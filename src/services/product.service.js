import { productModel } from '@/models/product.model.js'
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

const update = async (taskId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
      completedAt: !!reqBody?.status ? Date.now() : null
    }
    const updatedProduct = await productModel.update(taskId, updateData)
    return updatedProduct
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (productId) => {
  try {
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

export const productService = {
  createNew,
  getList,
  update,
  remove,
  getProductBySlug
}
