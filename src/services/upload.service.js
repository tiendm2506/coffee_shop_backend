import fs from 'fs'
import cloudinary from '@/config/cloudinary.js'
import { uploadModel } from '../models/upload.model.js'

const uploadImage = async (file) => {
  const FOLDER_NAME = 'images_coffee_shop'
  try {
    if (!file) throw new Error('No file uploaded')

    // upload image to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: FOLDER_NAME
    })

    // delete file local
    fs.unlinkSync(file.path)

    // Save DB
    await uploadModel.createUpload({
      url: result.secure_url,
      public_id: result.public_id,
      original_name: file.originalname
    })

    return {
      url: result.secure_url,
      public_id: result.public_id
    }
  } catch (error) {
    throw error
  }
}

export const uploadService = {
  uploadImage
}