import { authenticateToken } from './util/auth';
import { createZip } from './util/archive';

export default async function handler(req, res) {
  if (!authenticateToken(req)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { files } = req.body;
  await createZip(files, res);
}
