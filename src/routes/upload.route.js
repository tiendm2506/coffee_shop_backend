import express from 'express'
import { upload } from '../middlewares/upload.middleware.js'
import { uploadController } from '../controllers/upload.controller.js'

const uploadRouter = express.Router()
const MAX_FILES = 4 // Allow upload max 4 images

uploadRouter.post('/images', upload.array('uploads', MAX_FILES), uploadController.uploadMultipleImages)
uploadRouter.post('/image', upload.single('image'), uploadController.uploadSingleImage)
uploadRouter.delete('/image', uploadController.deleteImage)

export default uploadRouter