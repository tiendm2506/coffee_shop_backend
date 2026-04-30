import { uploadService } from '../services/upload.service.js'

const uploadImage = async (req, res, next) => {
  try {
    const file = req.file
    const result = await uploadService.uploadImage(file)
    return res.status(200).json({
      success: true,
      url: result.url
    })
  } catch (error) {
    next(error)
  }
}

export const uploadController = {
  uploadImage
}