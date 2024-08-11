import { authenticateToken } from './util/auth';
import { createZip } from './util/archive';

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
    await createZip(files, res);
  } catch (error) {
    console.error('Error creating zip:', error);
    return res.status(500).json({ message: 'Error creating zip' });
  }
}
