import { generateToken } from './util/auth';

const users = {
  'admin': { password: 'adminpassword', role: 'admin' },
  'company1': { password: 'password1', role: 'user' },
  'company2': { password: 'password2', role: 'user' },
};

export default function handler(req, res) {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    const token = generateToken(username, users[username].role);
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
}
