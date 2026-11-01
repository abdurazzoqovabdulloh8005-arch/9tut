const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // CORS Headers allowing cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const store = getStore({
      name: 'ccna-cloud-db',
      consistency: 'strong'
    });

    const key = (event.queryStringParameters && event.queryStringParameters.key) || 'users';

    // GET: Retrieve data
    if (event.httpMethod === 'GET') {
      const data = await store.get(key, { type: 'json' });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || [])
      };
    }

    // POST: Save or mutate data
    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body || '{}');

      if (payload.action === 'save_all') {
        await store.setJSON(key, payload.data || []);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
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
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, count: users.length }) };
      }

      if (payload.action === 'append') {
        let items = (await store.get(key, { type: 'json' })) || [];
        if (payload.item) {
          items.push(payload.item);
          // keep last 1000 items
          if (items.length > 1000) items = items.slice(-1000);
          await store.setJSON(key, items);
        }
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, total: items.length }) };
      }

      // Default: direct JSON save
      await store.setJSON(key, payload.data !== undefined ? payload.data : payload);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    console.error('Netlify Blobs sync error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal error' })
    };
  }
};
