import Joi from 'joi'
import { GET_DB } from '@/config/db.js'

const UPLOAD_COLLECTION_NAME = 'uploads'

const UPLOAD_COLLECTION_SCHEMA = Joi.object({
  url: Joi.string().uri().required(),
  public_id: Joi.string().trim().required(),
  original_name: Joi.string().trim().required(),
  createdAt: Joi.date()
    .timestamp('javascript')
    .default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await UPLOAD_COLLECTION_SCHEMA.validateAsync(
    data,
    {
      abortEarly: false
    }
  )
}

const createUpload = async (data) => {
  const validData =
    await validateBeforeCreate(data)

  return await GET_DB()
    .collection(UPLOAD_COLLECTION_NAME)
    .insertOne(validData)
}

const findByUrl = async (url) => {
  return await GET_DB()
    .collection(UPLOAD_COLLECTION_NAME)
    .findOne({ url })
}

const findByPublicId = async (public_id) => {
  return await GET_DB()
    .collection(UPLOAD_COLLECTION_NAME)
    .findOne({ public_id })
}

const deleteByPublicId = async (public_id) => {
  return await GET_DB()
    .collection(UPLOAD_COLLECTION_NAME)
    .deleteOne({ public_id })
}

const deleteByUrl = async (url) => {
  return await GET_DB()
    .collection(UPLOAD_COLLECTION_NAME)
    .deleteOne({ url })
}

const getList = async () => {
  return await GET_DB()
    .collection(UPLOAD_COLLECTION_NAME)
    .find({})
    .sort({ createdAt: -1 })
    .toArray()
}

export const uploadModel = {
  createUpload,
  findByUrl,
  findByPublicId,
  deleteByPublicId,
  deleteByUrl,
  getList
}