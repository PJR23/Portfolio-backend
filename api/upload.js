import { upload } from './util/storage';
import { authenticateToken, authorizeAdmin } from './util/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS-Header hinzufügen
  res.setHeader('Access-Control-Allow-Origin', '*'); // Erlaubt Anfragen von allen Ursprüngen
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); // Erlaubte HTTP-Methoden
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization'); // Erlaubte Header

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authentifizierung überprüfen
  if (!authenticateToken(req) || !authorizeAdmin(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  console.log('Starting upload process');
  
  // Middleware für Datei-Upload in einem Promise verwenden
  await new Promise((resolve, reject) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return reject(err);
      }
      resolve();
    });
  });

  console.log('Upload completed');

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('File uploaded successfully:', req.file);
  return res.status(200).json({ filePath: req.file.path });
}
