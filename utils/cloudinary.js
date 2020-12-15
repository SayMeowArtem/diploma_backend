require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'banancly123',
  api_key: '876415729472443',
  api_secret: 'DrUKldtGRa4XE8vcFyoavck0ngw',
});

module.exports = { cloudinary };
