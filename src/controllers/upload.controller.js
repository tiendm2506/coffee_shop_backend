import { uploadService } from '../services/upload.service.js'

const uploadMultipleImages = async (req, res, next) => {
  try {
    const files = req.files
    const result = await uploadService.uploadMultipleImages(files)
    return res.status(200).json({
      success: true,
      images: result
    })
  } catch (error) {
    next(error)
  }
}

export const uploadSingleImage = async (req, res, next) => {
  try {
    const file = req.file
    const result = await uploadService.uploadSingleImage(file)
    res.status(200).json({
      success: true,
      image: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteImage = async (req, res, next) => {
  try {
    const result = await uploadService.deleteImage(
      req.body.public_id
    )
    res.status(200).json({
      success: true,
      result
    })
  } catch (error) {
    next(error)
  }
}

export const uploadController = {
  uploadMultipleImages,
  uploadSingleImage,
  deleteImage
}