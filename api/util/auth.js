import jwt from 'jsonwebtoken';

const secretKey = 'your-secret-key';

export function authenticateToken(req) {
  return req.user || null;
}

export function authorizeAdmin(req) {
  return req.user && req.user.role === 'admin';
}

export function generateToken(username, role) {
  return jwt.sign({ username, role }, secretKey, { expiresIn: '1h' });
}
