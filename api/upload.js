import { upload } from './util/storage';
import { authenticateToken, authorizeAdmin } from './util/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (!authenticateToken(req) || !authorizeAdmin(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  upload.single('file')(req, {}, (err) => {
    if (err) return res.status(500).json({ message: 'File upload failed' });
    return res.status(200).json({ filePath: req.file.path });
  });
}
