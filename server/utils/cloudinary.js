const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'solo-sparks-reflections',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});


const uploadImage = multer({ storage : imageStorage });


module.exports = { cloudinary, 
    uploadImage,
  };
