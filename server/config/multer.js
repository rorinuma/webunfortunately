const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.${file.originalname}` )
  }
})

const upload = multer({
    
  storage: storage,
  limits:{fileSize:'1000000'},
  fileFilter:(req, file, cb)=>{
    const fileType = /jpeg|jpg|png|jfif|gif/
    const mimeType = fileType.test(file.mimetype)
    const extname = fileType.test(path.extname(file.originalname))
    if(mimeType && extname){
        return cb(null, true)
    }
    cb('Give proper file format to upload')
  }
})

module.exports = upload