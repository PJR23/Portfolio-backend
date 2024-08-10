import fs from 'fs-extra';
import { authenticateToken } from './util/auth';

export default async function handler(req, res) {
  if (!authenticateToken(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  fs.readdir('uploads', (err, files) => {
    if (err) return res.status(500).json({ message: 'Error reading files' });

    const fileData = files.filter(file => file.endsWith('.json')).map(file => {
      const fileInfo = fs.readFileSync(`uploads/${file}`);
      return JSON.parse(fileInfo);
    });

    return res.status(200).json({ files: fileData });
  });
}
