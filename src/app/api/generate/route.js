let tokens = {}; // In-memory storage. Use Redis/DB in production.

export async function POST(req) {
  const { url } = await req.json();

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
  }

  const expiresAt = Date.now() + 60 * 1000; // Token valid for 1 min
  const token = Math.random().toString(36).substring(2, 15);

  tokens[token] = { url, created: Date.now(), expiresAt };

  return new Response(JSON.stringify({ token }), { status: 200 });
}

// Utility to share with scan route
export function getTokenData(token) {
  return tokens[token];
}
