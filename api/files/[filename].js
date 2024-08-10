import fs from 'fs-extra';
import path from 'path';
import { authenticateToken } from './util/auth';

export default async function handler(req, res) {
  if (!authenticateToken(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const filePath = path.join('uploads', req.query.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return res.sendStatus(404);
    return res.sendFile(filePath);
  });
}
