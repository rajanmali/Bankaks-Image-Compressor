const { Router } = require('express');
const multer = require('multer');

const router = Router();
const { Storage } = require('@google-cloud/storage');

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
  },
});

router.post('/', uploader.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    // This is where we'll upload our file to Cloud Storage
    const storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID,
      keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
    });
    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    blobStream.on('error', (err) => next(err));
    blobStream.on('finish', () => {
      // Assembling public URL for accessing the file via HTTP
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`;

      // Return the file name and its public URL
      res
        .status(200)
        .send({ fileName: req.file.originalname, fileLocation: publicUrl });
    });

    // When there is no more data to be consumed from the stream
    blobStream.end(req.file.buffer);
    res.json({ test: 'test' });
  } catch (error) {
    res.status(400);
    next(error);
  }
});

module.exports = router;
