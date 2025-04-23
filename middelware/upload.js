const  fs = require('fs');
const multer = require('multer');
const path = require('path');

// Define storage configuration for multer
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename file to avoid conflicts
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).single('resume'); // The field name in your frontend form

const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 5MB limit' });
      }
    }
    return res.status(500).json({ error: 'An error occurred during file upload' });
  }
  // Validate that the resume file exists
if (!req.file) {
  return res.status(400).json({ error: "Please upload a resume" });
}

  next();
};
module.exports ={ upload, handleUploadError };
