// Vercel Serverless Function: /api/sync
// Supports:
// 1. IP detection (/api/sync?action=myip)
// 2. Netlify Blobs (if NETLIFY_SITE_ID + NETLIFY_AUTH_TOKEN configured)
// 3. Vercel KV / Upstash Redis (if KV_REST_API_URL + KV_REST_API_TOKEN configured)
// 4. Resilient In-Memory store fallback

// Global in-memory storage fallback for serverless instances
if (!globalThis.__ccna_mem_store) {
  globalThis.__ccna_mem_store = new Map();
}

async function getStorage() {
  // Option 1: Upstash / Vercel KV REST
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return {
      async get(key) {
        try {
          const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const d = await res.json();
          if (!d || d.result === null || d.result === undefined) return null;
          let val = d.result;
          while (typeof val === 'string') {
            try {
              const parsed = JSON.parse(val);
              if (parsed === val) break;
              val = parsed;
            } catch(e) {
              break;
            }
          }
          return val;
        } catch (e) {
          console.warn('KV get error:', e);
          return null;
        }
      },
      async set(key, val) {
        try {
          const stringified = typeof val === 'string' ? val : JSON.stringify(val);
          const res = await fetch(`${url}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(['SET', key, stringified])
          });
          return res.ok;
        } catch (e) {
          console.warn('KV set error:', e);
          return false;
        }
      }
    };
  }

  // Option 2: Netlify Blobs cross-connect
  if (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN) {
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore({
        name: 'ccna-cloud-db',
        consistency: 'strong',
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_AUTH_TOKEN
      });
      return {
        async get(key) {
          return await store.get(key, { type: 'json' });
        },
        async set(key, val) {
          await store.setJSON(key, val);
          return true;
        }
      };
    } catch (e) {
      console.warn('Netlify blobs init error:', e);
    }
  }

  // Option 3: Memory fallback
  return {
    async get(key) {
      return globalThis.__ccna_mem_store.get(key) || null;
    },
    async set(key, val) {
      globalThis.__ccna_mem_store.set(key, val);
      return true;
    }
  };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const action = req.query?.action;
    const key = req.query?.key || 'users';

    // Fast IP detection endpoint
    if (action === 'myip' || key === 'myip') {
      const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
                       req.headers['x-real-ip'] ||
                       req.headers['client-ip'] ||
                       req.socket?.remoteAddress ||
                       '127.0.0.1';
      return res.status(200).json({ ip: clientIp });
    }

    const store = await getStorage();

    // GET Request
    if (req.method === 'GET') {
      let data = await store.get(key);
      while (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed === data) break;
          data = parsed;
        } catch(e) {
          break;
        }
      }
      if (key === 'users' && Array.isArray(data)) {
        let deletedList = (await store.get('deleted_users')) || [];
        while (typeof deletedList === 'string') {
          try { deletedList = JSON.parse(deletedList); } catch(e) { break; }
        }
        if (Array.isArray(deletedList) && deletedList.length > 0) {
          const delSet = new Set(deletedList.map(s => String(s).toLowerCase()));
          data = data.filter(u => {
            if (!u) return false;
            const uid = String(u.id || '').toLowerCase();
            const ulog = String(u.login || '').trim().toLowerCase();
            return !delSet.has(uid) && !delSet.has(ulog);
          });
        }
      }
      return res.status(200).json(data || []);
    }

    // POST Request
    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

      // DELETE USER action
      if (payload.action === 'delete_user') {
        const targetId = String(payload.id || '');
        const targetLogin = String(payload.login || '').trim().toLowerCase();

        let users = (await store.get('users')) || [];
        while (typeof users === 'string') {
          try { users = JSON.parse(users); } catch(e) { break; }
        }
        if (Array.isArray(users)) {
          users = users.filter(u => {
            if (!u) return false;
            const uid = String(u.id || '');
            const ulog = String(u.login || '').trim().toLowerCase();
            if (targetId && uid === targetId) return false;
            if (targetLogin && ulog === targetLogin) return false;
            return true;
          });
          await store.set('users', users);
        }

        let deletedList = (await store.get('deleted_users')) || [];
        while (typeof deletedList === 'string') {
          try { deletedList = JSON.parse(deletedList); } catch(e) { break; }
        }
        if (!Array.isArray(deletedList)) deletedList = [];
        if (targetLogin && !deletedList.includes(targetLogin)) deletedList.push(targetLogin);
        if (targetId && !deletedList.includes(targetId)) deletedList.push(targetId);
        if (deletedList.length > 500) deletedList = deletedList.slice(-500);
        await store.set('deleted_users', deletedList);

        // Also purge test results for deleted student
        let results = (await store.get('results')) || [];
        while (typeof results === 'string') {
          try { results = JSON.parse(results); } catch(e) { break; }
        }
        if (Array.isArray(results)) {
          results = results.filter(r => {
            if (!r) return false;
            const rLog = String(r.login || '').trim().toLowerCase();
            const rName = String(r.studentName || '').trim().toLowerCase();
            if (targetLogin && (rLog === targetLogin || rName === targetLogin)) return false;
            return true;
          });
          await store.set('results', results);
        }

        return res.status(200).json({ success: true, count: Array.isArray(users) ? users.length : 0 });
      }

      // CLEAR ALL USERS action
      if (payload.action === 'clear_all_users') {
        await store.set('users', []);
        await store.set('deleted_users', []);
        return res.status(200).json({ success: true, count: 0, message: 'All users cleared from cloud database.' });
      }

      // SAVE ALL
      if (payload.action === 'save_all') {
        let toSave = payload.data || [];
        while (typeof toSave === 'string') {
          try { toSave = JSON.parse(toSave); } catch(e) { break; }
        }

        if (key === 'users' && Array.isArray(toSave)) {
          let currentUsers = (await store.get('users')) || [];
          while (typeof currentUsers === 'string') {
            try { currentUsers = JSON.parse(currentUsers); } catch(e) { break; }
          }
          if (!Array.isArray(currentUsers)) currentUsers = [];

          // SMART MERGE: Never allow incoming partial user list to wipe existing users!
          const userMap = new Map();
          currentUsers.forEach(u => {
            if (u && u.login) userMap.set(String(u.login).trim().toLowerCase(), u);
          });
          toSave.forEach(u => {
            if (u && u.login) {
              const k = String(u.login).trim().toLowerCase();
              const existing = userMap.get(k);
              userMap.set(k, { ...(existing || {}), ...u });
            }
          });
          toSave = Array.from(userMap.values());

          let deletedList = (await store.get('deleted_users')) || [];
          while (typeof deletedList === 'string') {
            try { deletedList = JSON.parse(deletedList); } catch(e) { break; }
          }
          if (Array.isArray(deletedList) && deletedList.length > 0) {
            const delSet = new Set(deletedList.map(s => String(s).toLowerCase()));
            toSave = toSave.filter(u => {
              if (!u) return false;
              const uid = String(u.id || '').toLowerCase();
              const ulog = String(u.login || '').trim().toLowerCase();
              return !delSet.has(uid) && !delSet.has(ulog);
            });
          }
        }

        if (key === 'results' && Array.isArray(toSave)) {
          let currentResults = (await store.get('results')) || [];
          while (typeof currentResults === 'string') {
            try { currentResults = JSON.parse(currentResults); } catch(e) { break; }
          }
          if (!Array.isArray(currentResults)) currentResults = [];

          // SMART MERGE: Never allow one user's quiz completion to wipe other users' test results!
          const resMap = new Map();
          currentResults.forEach(r => {
            if (r) {
              const k = r.id || `${r.login || r.studentName}_${r.partKey || r.partTitle}_${r.timestamp || r.date}`;
              resMap.set(k, r);
            }
          });
          toSave.forEach(r => {
            if (r) {
              const k = r.id || `${r.login || r.studentName}_${r.partKey || r.partTitle}_${r.timestamp || r.date}`;
              resMap.set(k, r);
            }
          });
          toSave = Array.from(resMap.values());
          // Sort newest first
          toSave.sort((a, b) => {
            const ta = new Date(a.date || a.timestamp || a.createdAt || 0).getTime() || 0;
            const tb = new Date(b.date || b.timestamp || b.createdAt || 0).getTime() || 0;
            return tb - ta;
          });
          if (toSave.length > 3000) toSave = toSave.slice(0, 3000);
        }

        await store.set(key, toSave);
        return res.status(200).json({ success: true, count: Array.isArray(toSave) ? toSave.length : 0 });
      }

      // UPSERT USER
      if (payload.action === 'upsert_user') {
        let users = (await store.get('users')) || [];
        while (typeof users === 'string') {
          try { users = JSON.parse(users); } catch(e) { break; }
        }
        if (!Array.isArray(users)) users = [];
        const newUser = payload.user;

        let deletedList = (await store.get('deleted_users')) || [];
        while (typeof deletedList === 'string') {
          try { deletedList = JSON.parse(deletedList); } catch(e) { break; }
        }
        if (Array.isArray(deletedList) && newUser) {
          const uId = String(newUser.id || '');
          const uLog = String(newUser.login || '').toLowerCase();
          deletedList = deletedList.filter(item => item !== uId && item !== uLog);
          await store.set('deleted_users', deletedList);
        }

        if (newUser) {
          const idx = users.findIndex(u => (u.id && u.id === newUser.id) || (u.login && u.login.toLowerCase() === newUser.login.toLowerCase()));
          if (idx >= 0) {
            users[idx] = { ...users[idx], ...newUser };
          } else {
            users.push(newUser);
          }
          await store.set('users', users);
        }
        return res.status(200).json({ success: true, count: users.length });
      }

      // APPEND
      if (payload.action === 'append') {
        let list = (await store.get(key)) || [];
        while (typeof list === 'string') {
          try { list = JSON.parse(list); } catch(e) { break; }
        }
        if (!Array.isArray(list)) list = [];
        const item = payload.data || payload.item;
        if (item) {
          if (key === 'results') {
            // Deduplicate by result id or composite key
            const itemKey = item.id || `${item.login || item.studentName}_${item.partKey || item.partTitle}_${item.timestamp || item.date}`;
            const existingIdx = list.findIndex(r => {
              if (!r) return false;
              const rKey = r.id || `${r.login || r.studentName}_${r.partKey || r.partTitle}_${r.timestamp || r.date}`;
              return rKey === itemKey;
            });
            if (existingIdx >= 0) {
              list[existingIdx] = { ...list[existingIdx], ...item };
            } else {
              list.unshift(item); // Newest at top
            }
            if (list.length > 3000) list = list.slice(0, 3000);
          } else {
            list.push(item);
            if (list.length > 1500) list = list.slice(-1500);
          }
          await store.set(key, list);
        }
        return res.status(200).json({ success: true, count: list.length });
      }

      // Direct save
      if (payload.data !== undefined) {
        await store.set(key, payload.data);
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Unknown action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vercel API sync error:', error);
    return res.status(500).json({ error: error.message });
  }
}
