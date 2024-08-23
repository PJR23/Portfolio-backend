import { generateToken } from './util/auth';

const users = {
  'admin': { password: 'adminpassword', role: 'admin' },
  'company1': { password: 'password1', role: 'user' },
  'company2': { password: 'password2', role: 'user' },
};

export default function handler(req, res) {
  // Füge CORS-Header hinzu
  res.setHeader('Access-Control-Allow-Origin', 'https://paulrehbein.com/'); // Erlaubt Anfragen von allen Ursprüngen
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); // Erlaubte HTTP-Methoden
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization'); // Erlaubte Header

  if (req.method === 'OPTIONS') {
    // Handle CORS preflight requests
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (users[username] && users[username].password === password) {
      const token = generateToken(username, users[username].role);
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: 'Method not allowed' });
  }
}