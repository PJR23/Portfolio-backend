import archiver from 'archiver';
import path from 'path';
import fs from 'fs-extra';

export async function createZip(files, res) {
  try {
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');

    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    for (const file of files) {
      const filePath = path.join(process.cwd(), 'api', 'files', file); // Neuer Speicherort der Dateien

      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error('Error creating ZIP archive:', error);
    res.status(500).json({ message: 'Error creating ZIP archive' });
  }
}
