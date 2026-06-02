import { productModel } from '@/models/product.model.js'
import { uploadModel } from '@/models/upload.model.js'
import { orderModel } from '@/models/order.model.js'
import cloudinary from '@/config/cloudinary.js'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '../utils/constant.utils.js'

const createNew = async (reqBody) => {
  try {
    const result = await productModel.createNew(reqBody)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async (page, limit, queryFilters) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!limit) limit = DEFAULT_ITEMS_PER_PAGE
    const data = await productModel.getList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      queryFilters
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (productId, reqBody) => {
  try {
    const oldProduct = await productModel.findOneById(productId)
    if (!oldProduct) throw new Error('Product not found')
    const oldImages = oldProduct.images || []
    const newImages = reqBody.images || []
    const removedImages = oldImages.filter(
      img => !newImages.includes(img)
    )
    for (const imageUrl of removedImages) {
      const upload = await uploadModel.findByUrl(imageUrl)
      if (upload?.public_id) {
        await cloudinary.uploader.destroy(upload.public_id)
        await uploadModel.deleteByPublicId(upload.public_id)
      }
    }
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    return await productModel.update(productId, updateData)
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (productId) => {
  try {
    const product = await productModel.findOneById(productId)
    if (!product) throw new Error('Product not found')
    for (const imageUrl of product.images || []) {
      const upload = await uploadModel.findByUrl(imageUrl)
      if (upload?.public_id) {
        await cloudinary.uploader.destroy(upload.public_id)
        await uploadModel.deleteByPublicId(upload.public_id)
      }
    }
    const result = await productModel.remove(productId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getProductBySlug = async (req, res) => {
  try {
    const result = await productModel.getProductBySlug(req, res)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getBestSellingProduct = async (limit) => {
  try {
    const result = await orderModel.getBestSellingProduct(limit)
    return result
  } catch (error) {
    throw new Error(error)
  }
}


export const productService = {
  createNew,
  getList,
  update,
  remove,
  getProductBySlug,
  getBestSellingProduct
}
