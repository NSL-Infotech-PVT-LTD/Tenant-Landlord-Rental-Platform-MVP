const multer = require('multer');
const cors = require('cors');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3-v3'); // A wrapper for multer with AWS SDK v3

// DigitalOcean Spaces configuration
const SPACE_NAME = 'whuups'; // Space name
const SPACE_REGION = 'lon1';

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
// Configure the S3 Client for DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: `https://${SPACE_REGION}.digitaloceanspaces.com`,
  region: SPACE_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// Multer Configuration for DigitalOcean Spaces using AWS SDK v3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: SPACE_NAME,
    acl: 'public-read', // Make files publicly accessible
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `MVP/${Date.now()}-${file.originalname}`); // Create a unique file path
    },
  }),
});
module.exports =upload