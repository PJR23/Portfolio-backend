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
  res.setHeader('Access-Control-Allow-Origin', 'https://paulrehbein.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!authenticateToken(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { fileName } = req.query;
  if (!fileName) {
    return res.status(400).json({ message: 'File name is required' });
  }

  const filePath = path.join(process.cwd(), 'api', 'files', fileName);

  try {
    // Set Content-Type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error('Error reading file:', err);
    return res.status(500).json({ message: 'Error reading file' });
  }
}
