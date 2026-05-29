import multer from 'multer'
import path from 'path'
import fs from 'fs'

// create folder if not exists
const uploadDir = 'uploads/'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`
    cb(null, fileName)
  }
})

// validate file
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new Error('Only image files allowed'), false)
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})