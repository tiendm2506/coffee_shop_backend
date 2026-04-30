import { GET_DB } from '@/config/db.js'

const COLLECTION_NAME = 'uploads'

const createUpload = async (data) => {
  return await GET_DB().collection(COLLECTION_NAME).insertOne({
    ...data,
    createdAt: new Date()
  })
}
export const uploadModel = {
  createUpload
}