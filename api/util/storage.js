import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    const fileInfo = {
      originalName: file.originalname,
      storedName: uniqueName
    };
    fs.writeFileSync(`uploads/${uniqueName}.json`, JSON.stringify(fileInfo));
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
