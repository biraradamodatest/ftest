
require('dotenv').config()
var cloudinary = require('cloudinary').v2;
let streamifier = require('streamifier');
cloudinary.config({
  cloud_name: 'codergihub',
  api_key: '583195742238215',
  api_secret: process.env.cloudinary_secret,
  secure: true
})
function cloudinaryUploader(buffer, public_id) {

  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: 'nav',
        public_id, resource_type: 'raw',
      },
      (error, result) => {

        if (result) {

          resolve(result);
          console.log('uploaded')
        } else {
          debugger
          console.log('error', error)
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });


}

module.exports = { cloudinaryUploader }