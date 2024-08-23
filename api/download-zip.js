import { authenticateToken } from './util/auth';
import { createZip } from './util/archive';
import path from 'path';
import fs from 'fs-extra';

export const config = {
  api: {
    bodyParser: false, // Bei Verwendung von FormData, stellen Sie sicher, dass bodyParser deaktiviert ist
  },
};

export default async function handler(req, res) {
  // CORS-Header hinzufügen
  res.setHeader('Access-Control-Allow-Origin', 'https://paulrehbein.com'); // Erlaubt Anfragen von allen Ursprüngen
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Erlaubte HTTP-Methoden
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Erlaubte Header

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authentifizierung überprüfen
  if (!authenticateToken(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { files } = req.body;

  try {
    if (files.length === 1) {
      // Einzelne Datei direkt zurückgeben
      const filePath = path.join(process.cwd(), 'api', 'files', files[0]);
      
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${files[0]}"`);
        return fs.createReadStream(filePath).pipe(res);
      } else {
        return res.status(404).json({ message: 'File not found' });
      }
    } else {
      // ZIP-Archiv erstellen und zurückgeben
      await createZip(files, res);
    }
  } catch (error) {
    console.error('Error handling file download:', error);
    return res.status(500).json({ message: 'Error handling file download' });
  }
}
