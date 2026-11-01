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
      const data = await store.get(key, { type: 'json' });
      return new Response(JSON.stringify(data || []), { status: 200, headers });
    }

    // POST Request: Save or mutate data
    if (req.method === 'POST') {
      const payload = await req.json().catch(() => ({}));

      if (payload.action === 'save_all') {
        await store.setJSON(key, payload.data || []);
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }

      if (payload.action === 'upsert_user') {
        let users = (await store.get('users', { type: 'json' })) || [];
        const user = payload.user;
        const idx = users.findIndex(u => u.login === user.login || u.id === user.id);
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
