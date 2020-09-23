/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const multer = require('multer');

const { diskStorage } = multer;
const { extname } = require('path');
const { existsSync, mkdirSync } = require('fs');
// import uuid from "uuid/v4";

const storageMultiple = diskStorage({
  destination(req, file, cb) {
    const dir = 'public/images';
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
});

const uploadMultiple = multer({
  storage: storageMultiple,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).array('image', 12);

// Set storage engine
const storage = diskStorage({
  destination: 'public/images',
  filename(req, file, cb) {
    cb(null, Date.now() + extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// // Check file Type
const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extName = fileTypes.test(extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  }
  return cb('Error: Images Only !!!');
};

module.exports = { upload, uploadMultiple };
