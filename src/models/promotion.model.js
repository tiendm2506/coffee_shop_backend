import Joi from 'joi'
import { GET_DB } from '@/config/db.js'
import { ObjectId } from 'mongodb'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '@/utils/constant.utils.js'

const PROMOTION_COLLECTION_NAME = 'promotion_code'

const PROMOTION_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(100).trim(),
  type: Joi.string().trim(),
  value: Joi.string().trim(),
  expired_date: Joi.string().trim(),
  status: Joi.string().trim(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await PROMOTION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const newPromotionToAdd = {
      ...validatedData
    }
    const result = await GET_DB().collection(PROMOTION_COLLECTION_NAME).insertOne(newPromotionToAdd)
    const createdPromotion = await GET_DB()
      .collection(PROMOTION_COLLECTION_NAME)
      .findOne({ _id: result.insertedId })
    return createdPromotion
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_ITEMS_PER_PAGE,
  queryFilters = {}
}) => {
  try {
    const skip = (page - 1) * limit
    const query = {}
    const result = await GET_DB().collection(PROMOTION_COLLECTION_NAME)

    // remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(queryFilters).filter(([_, v]) => v !== undefined)
    )

    // search filter
    if (cleanFilters.q) {
      query.name = {
        $regex: cleanFilters.q,
        $options: 'i'
      }
    }

    if (cleanFilters.exclude) {
      query._id = { $ne: new ObjectId(cleanFilters.exclude) }
    }

    const [promotions, total] = await Promise.all([
      result
        .find(query)
        .sort({ _id: -1 }) // createdAt
        .skip(skip)
        .limit(limit)
        .toArray(),

      result.countDocuments(query)
    ])

    return {
      promotions,
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

const update = async (promotionId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const validatedUpdateData = await validateBeforeCreate(updateData)
    const newUpdateData = { ...validatedUpdateData }

    const result = await GET_DB()
      .collection(promotion_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(promotionId) },
        { $set: newUpdateData },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (promotionId) => {
  try {
    const result = await GET_DB().collection(PROMOTION_COLLECTION_NAME).findOneAndDelete({ _id: new ObjectId(promotionId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getpromotionBySlug = async (req, res) => {
  try {
    const promotion = await GET_DB().collection(PROMOTION_COLLECTION_NAME).findOne({ slug: req.params.slug })
    if (!promotion) return res.status(404).json({ message: 'Not found promotion.' })
    return promotion
  } catch (error) {
    throw new Error(error)
  }
}

export const promotionModel = {
  createNew,
  getList,
  update,
  remove,
  getpromotionBySlug
}