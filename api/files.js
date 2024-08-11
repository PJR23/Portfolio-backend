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
  res.setHeader('Access-Control-Allow-Origin', '*'); // Erlaubt Anfragen von allen Ursprüngen
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS'); // Erlaubte HTTP-Methoden
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization'); // Erlaubte Header

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authentifizierung überprüfen
  if (!authenticateToken(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads'); // Sicherstellen, dass der Pfad korrekt ist

  // Dateien im 'uploads'-Verzeichnis lesen
  try {
    const files = await fs.readdir(uploadsDir);
    const fileData = files.map(file => ({
      fileName: file,
      filePath: `${file}`  // Hier wird der Pfad zur Datei relativ zum öffentlichen Verzeichnis erstellt
    }));

    return res.status(200).json({ files: fileData });
  } catch (err) {
    console.error('Error reading files:', err);
    return res.status(500).json({ message: 'Error reading files' });
  }
}
