import Joi from 'joi'
import { GET_DB } from '@/config/db.js'
import { ObjectId } from 'mongodb'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '@/utils/constant.utils.js'

const PRODUCT_COLLECTION_NAME = 'products'

const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(100).trim(),
  image: Joi.string().trim(),
  description: Joi.string().trim(),
  detail: Joi.string().trim(),
  on_sale: Joi.boolean(),
  origin_price: Joi.string(),
  promotion_price: Joi.string(),
  category: Joi.string(),
  category_slug: Joi.string(),
  highlight: Joi.boolean(),
  status: Joi.string(),
  amount_in_stock: Joi.string(),
  slug: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const newProductToAdd = {
      ...validatedData
    }
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).insertOne(newProductToAdd)
    const createdProduct = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .findOne({ _id: result.insertedId })
    return createdProduct
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
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME)

    // remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(queryFilters).filter(([_, v]) => v !== undefined)
    )

    // highlight filter
    if (cleanFilters.highlight != null) {
      query.highlight =
        cleanFilters.highlight === 'true' ||
        cleanFilters.highlight === true
    }

    // category filter
    if (cleanFilters.category_slug) {
      query.category_slug = cleanFilters.category_slug
    }

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

    const [products, total] = await Promise.all([
      result
        .find(query)
        .sort({ _id: -1 }) // createdAt
        .skip(skip)
        .limit(limit)
        .toArray(),

      result.countDocuments(query)
    ])

    return {
      products,
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

const update = async (taskId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const validatedUpdateData = await validateBeforeCreate(updateData)
    const newUpdateData = { ...validatedUpdateData }

    const result = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        { $set: newUpdateData },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (productId) => {
  try {
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndDelete({ _id: new ObjectId(productId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getProductBySlug = async (req, res) => {
  try {
    const product = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({ slug: req.params.slug })
    if (!product) return res.status(404).json({ message: 'Not found product.' })
    return product
  } catch (error) {
    throw new Error(error)
  }
}

export const productModel = {
  createNew,
  getList,
  update,
  remove,
  getProductBySlug
}