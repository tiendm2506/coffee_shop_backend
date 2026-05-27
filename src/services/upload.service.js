import fs from 'fs'
import cloudinary from '@/config/cloudinary.js'
import { uploadModel } from '../models/upload.model.js'

const FOLDER_NAME = 'images_coffee_shop'

const uploadMultipleImages = async (files) => {
  if (!files?.length) {
    throw new Error('No files uploaded' )
  }
  const results =
    await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { folder: FOLDER_NAME })
        fs.unlinkSync(file.path)
        await uploadModel.createUpload({
          url: result.secure_url,
          public_id: result.public_id,
          original_name: file.originalname
        })
        return {
          url: result.secure_url,
          public_id: result.public_id
        }
      })
    )
  return results
}

const uploadSingleImage = async (file) => {
  if (!file) throw new Error('No file uploaded')
  const result = await cloudinary.uploader.upload(file.path, { folder: FOLDER_NAME })
  fs.unlinkSync(file.path)
  await uploadModel.createUpload({
    url: result.secure_url,
    public_id: result.public_id,
    original_name: file.originalname
  })
  return {
    url: result.secure_url,
    public_id: result.public_id
  }
}

const deleteImage = async (publicId) => {
  if (!publicId) throw new Error('public_id required')
  await cloudinary.uploader.destroy(publicId)
  await uploadModel.deleteByPublicId(publicId)
  return true
}

const deleteImageByUrl = async (url) => {
  const image = await uploadModel.findByUrl(url)
  if (!image) return
  await cloudinary.uploader.destroy(image.public_id)
  await uploadModel.deleteByPublicId(
    image.public_id
  )
}

export const uploadService = {
  uploadMultipleImages,
  uploadSingleImage,
  deleteImage,
  deleteImageByUrl
}