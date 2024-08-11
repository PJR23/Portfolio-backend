import jwt from 'jsonwebtoken';

const secretKey = 'your-secret-key';

export function authenticateToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Token ist in der Form "Bearer token"

  if (!token) return null;

  try {
    const user = jwt.verify(token, secretKey);
    return user;
  } catch (err) {
    return null;
  }
}

export function authorizeAdmin(req) {
  const user = authenticateToken(req);
  return user && user.role === 'admin';
}

export function generateToken(username, role) {
  return jwt.sign({ username, role }, secretKey, { expiresIn: '1h' });
}
