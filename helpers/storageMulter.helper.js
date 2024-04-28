const multer  = require('multer')

module.exports  = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const fieldname = Date.now() + "-" + file.originalname
      cb(null, fieldname)
    }
})