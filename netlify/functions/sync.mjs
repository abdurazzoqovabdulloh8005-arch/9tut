import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  try {
    const store = getStore({
      name: 'ccna-cloud-db',
      consistency: 'strong'
    });

    const url = new URL(req.url);
    const key = url.searchParams.get('key') || 'users';

    // GET Request: Retrieve data
    if (req.method === 'GET') {
      let data = await store.get(key, { type: 'json' });
      if (key === 'users' && Array.isArray(data)) {
        let deletedList = (await store.get('deleted_users', { type: 'json' })) || [];
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
      return new Response(JSON.stringify(data || []), { status: 200, headers });
    }

    // POST Request: Save or mutate data
    if (req.method === 'POST') {
      const payload = await req.json().catch(() => ({}));

      // DELETE USER action: removes user and adds tombstone
      if (payload.action === 'delete_user') {
        const targetId = String(payload.id || '');
        const targetLogin = String(payload.login || '').trim().toLowerCase();

        let users = (await store.get('users', { type: 'json' })) || [];
        users = users.filter(u => {
          if (!u) return false;
          const uid = String(u.id || '');
          const ulog = String(u.login || '').trim().toLowerCase();
          if (targetId && uid === targetId) return false;
          if (targetLogin && ulog === targetLogin) return false;
          return true;
        });
        await store.setJSON('users', users);

        let deletedList = (await store.get('deleted_users', { type: 'json' })) || [];
        if (targetLogin && !deletedList.includes(targetLogin)) deletedList.push(targetLogin);
        if (targetId && !deletedList.includes(targetId)) deletedList.push(targetId);
        if (deletedList.length > 500) deletedList = deletedList.slice(-500);
        await store.setJSON('deleted_users', deletedList);

        return new Response(JSON.stringify({ success: true, count: users.length }), { status: 200, headers });
      }

      if (payload.action === 'save_all') {
        let toSave = payload.data || [];
        if (key === 'users' && Array.isArray(toSave)) {
          let deletedList = (await store.get('deleted_users', { type: 'json' })) || [];
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
        await store.setJSON(key, toSave);
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }

      if (payload.action === 'upsert_user') {
        let users = (await store.get('users', { type: 'json' })) || [];
        const user = payload.user;
        if (!user || !user.login) {
          return new Response(JSON.stringify({ error: 'Invalid user' }), { status: 400, headers });
        }
        const userLog = String(user.login).trim().toLowerCase();
        const userId = String(user.id || '');

        // If newly created/registered, un-tombstone it
        let deletedList = (await store.get('deleted_users', { type: 'json' })) || [];
        if (deletedList.includes(userLog) || deletedList.includes(userId)) {
          deletedList = deletedList.filter(s => s !== userLog && s !== userId);
          await store.setJSON('deleted_users', deletedList);
        }

        const idx = users.findIndex(u => (u.login || '').toLowerCase() === userLog || (userId && String(u.id) === userId));
        if (idx >= 0) {
          users[idx] = Object.assign(users[idx], user);
        } else {
          users.push(user);
        }
        await store.setJSON('users', users);
        return new Response(JSON.stringify({ success: true, count: users.length }), { status: 200, headers });
      }

      if (payload.action === 'append') {
        let items = (await store.get(key, { type: 'json' })) || [];
        if (payload.item) {
          items.push(payload.item);
          if (items.length > 1000) items = items.slice(-1000);
          await store.setJSON(key, items);
        }
        return new Response(JSON.stringify({ success: true, total: items.length }), { status: 200, headers });
      }

      await store.setJSON(key, payload.data !== undefined ? payload.data : payload);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};
