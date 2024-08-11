import { authenticateToken, generateToken } from './util/auth';

export default function handler(req, res) {
  // Setzen der CORS-Header
  res.setHeader('Access-Control-Allow-Origin', '*'); // Erlaubt alle Ursprünge, passe dies entsprechend an
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    // Behandle Preflight-Anfragen
    return res.status(200).end();
  }

  const user = authenticateToken(req);
  if (!user) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const newToken = generateToken(user.username, user.role);
  return res.status(200).json({ token: newToken });
}
