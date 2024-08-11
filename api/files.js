import fs from 'fs-extra';
import path from 'path';
import { authenticateToken } from './util/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS-Header hinzufügen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!authenticateToken(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const uploadsDir = path.join(process.cwd(), 'api', 'files'); // Neuer Speicherort der Dateien

  try {
    const files = await fs.readdir(uploadsDir);
    const fileData = files.map(file => ({
      fileName: file,
      filePath: `${file}`
    }));

    return res.status(200).json({ files: fileData });
  } catch (err) {
    console.error('Error reading files:', err);
    return res.status(500).json({ message: 'Error reading files' });
  }
}
