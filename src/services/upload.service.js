import fs from 'fs'
import cloudinary from '@/config/cloudinary.js'
import { uploadModel } from '../models/upload.model.js'

const uploadImages = async (files) => {
  const FOLDER_NAME = 'images_coffee_shop'
  if (!files?.length) {
    throw new Error('No files uploaded' )
  }
  const results =
    await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(
          file.path,
          { folder: FOLDER_NAME }
        )
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

export const uploadService = {
  uploadImages
}