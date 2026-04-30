import Joi from 'joi'
import { GET_DB } from '@/config/db.js'
import { ObjectId } from 'mongodb'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '@/utils/constant.utils.js'

const CATEGORY_COLLECTION_NAME = 'categories'

const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(100).trim(),
  slug: Joi.string(),
  status: Joi.string(),
  type: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await CATEGORY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const newCategoryToAdd = {
      ...validatedData
    }
    const result = await GET_DB().collection(CATEGORY_COLLECTION_NAME).insertOne(newCategoryToAdd)
    const createdCategory = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOne({ _id: result.insertedId })
    return createdCategory
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_ITEMS_PER_PAGE,
  type
}) => {
  try {
    const skip = (page - 1) * limit
    const query = {}
    const result = await GET_DB().collection(CATEGORY_COLLECTION_NAME)
    if (type) {
      query.type = type
    }


    const [categories, total] = await Promise.all([
      result
        .find(query)
        .sort({ _id: -1 }) // createdAt
        .skip(skip)
        .limit(limit)
        .toArray(),

      result.countDocuments(query)
    ])

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (categoryId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const validatedUpdateData = await validateBeforeCreate(updateData)
    const newUpdateData = { ...validatedUpdateData }

    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(categoryId) },
        { $set: newUpdateData },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (categoryId) => {
  try {
    const result = await GET_DB().collection(CATEGORY_COLLECTION_NAME).findOneAndDelete({ _id: new ObjectId(categoryId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const categoryModel = {
  createNew,
  getList,
  update,
  remove
}