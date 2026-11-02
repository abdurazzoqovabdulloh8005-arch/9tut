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
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    return {
      async get(key) {
        try {
          const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const d = await res.json();
          if (!d || d.result === null || d.result === undefined) return null;
          return typeof d.result === 'string' ? JSON.parse(d.result) : d.result;
        } catch (e) {
          console.warn('KV get error:', e);
          return null;
        }
      },
      async set(key, val) {
        try {
          await fetch(`${url}/set/${encodeURIComponent(key)}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.stringify(val))
          });
          return true;
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
      if (key === 'users' && Array.isArray(data)) {
        let deletedList = (await store.get('deleted_users')) || [];
        if (deletedList.length > 0) {
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
        if (!Array.isArray(deletedList)) deletedList = [];
        if (targetLogin && !deletedList.includes(targetLogin)) deletedList.push(targetLogin);
        if (targetId && !deletedList.includes(targetId)) deletedList.push(targetId);
        if (deletedList.length > 500) deletedList = deletedList.slice(-500);
        await store.set('deleted_users', deletedList);

        return res.status(200).json({ success: true, count: Array.isArray(users) ? users.length : 0 });
      }

      // SAVE ALL
      if (payload.action === 'save_all') {
        let toSave = payload.data || [];
        if (key === 'users' && Array.isArray(toSave)) {
          let deletedList = (await store.get('deleted_users')) || [];
          if (deletedList.length > 0) {
            const delSet = new Set(deletedList.map(s => String(s).toLowerCase()));
            toSave = toSave.filter(u => {
              if (!u) return false;
              const uid = String(u.id || '').toLowerCase();
              const ulog = String(u.login || '').trim().toLowerCase();
              return !delSet.has(uid) && !delSet.has(ulog);
            });
          }
        }
        await store.set(key, toSave);
        return res.status(200).json({ success: true });
      }

      // UPSERT USER
      if (payload.action === 'upsert_user') {
        let users = (await store.get('users')) || [];
        if (!Array.isArray(users)) users = [];
        const newUser = payload.user;

        let deletedList = (await store.get('deleted_users')) || [];
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
        if (!Array.isArray(list)) list = [];
        if (payload.data) {
          list.push(payload.data);
          if (list.length > 1500) list = list.slice(-1500);
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
