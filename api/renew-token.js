import { authenticateToken, generateToken } from './util/auth';

export default function handler(req, res) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const newToken = generateToken(user.username, user.role);
  return res.status(200).json({ token: newToken });
}
