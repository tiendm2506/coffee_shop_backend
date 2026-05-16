import { uploadService } from '../services/upload.service.js'

const uploadImages = async (req, res, next) => {
  try {
    const files = req.files
    const result = await uploadService.uploadImages(files)
    return res.status(200).json({
      success: true,
      images: result
    })
  } catch (error) {
    next(error)
  }
}

export const uploadController = {
  uploadImages
}