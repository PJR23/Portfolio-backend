import archiver from 'archiver';
import path from 'path';
import fs from 'fs-extra';

export async function createZip(files, res) {
  const archive = archiver('zip', { zlib: { level: 9 } });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');

  archive.on('error', (err) => res.status(500).send({ error: err.message }));

  archive.pipe(res);

  for (const file of files) {
    const filePath = path.join('uploads', file);
    const jsonFilePath = `${filePath}.json`;
    if (fs.existsSync(jsonFilePath)) {
      const fileInfo = JSON.parse(fs.readFileSync(jsonFilePath));
      archive.file(filePath, { name: fileInfo.originalName });
    }
  }

  await archive.finalize();
}
