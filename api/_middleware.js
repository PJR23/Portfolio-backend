import { jwtVerify } from 'jose';
const secretKey = 'your-secret-key';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function middleware(req, ev) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
      req.user = payload;
    } catch (err) {
      return new Response('Unauthorized', { status: 403 });
    }
  }

  return new Response(null, { status: 200 });
}
