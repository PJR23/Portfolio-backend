import fs from 'fs-extra';
import path from 'path';
import { authenticateToken } from './util/auth';

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

  const filePath = path.join('uploads', req.query.filename);
  
  // Dateiüberprüfung und Antwort senden
  try {
    await fs.access(filePath, fs.constants.F_OK); // Überprüfe, ob die Datei existiert
    return res.sendFile(filePath);
  } catch (err) {
    return res.sendStatus(404); // Datei nicht gefunden
  }
}
