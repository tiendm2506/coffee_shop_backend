import express from 'express'
import { upload } from '../middlewares/upload.middleware.js'
import { uploadController } from '../controllers/upload.controller.js'

const uploadRouter = express.Router()

uploadRouter.post('/upload', upload.single('upload'), uploadController.uploadImage)

export default uploadRouter