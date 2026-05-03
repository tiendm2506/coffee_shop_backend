import { promotionModel } from '@/models/promotion.model.js'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '../utils/constant.utils.js'

const createNew = async (reqBody) => {
  try {
    const result = await promotionModel.createNew(reqBody)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async (page, limit, queryFilters) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!limit) limit = DEFAULT_ITEMS_PER_PAGE
    const data = await promotionModel.getList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      queryFilters
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (promotionId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    }
    const updatedpromotion = await promotionModel.update(promotionId, updateData)
    return updatedpromotion
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (promotionId) => {
  try {
    const result = await promotionModel.remove(promotionId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getPromotionBySlug = async (req, res) => {
  try {
    const result = await promotionModel.getPromotionBySlug(req, res)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const promotionService = {
  createNew,
  getList,
  update,
  remove,
  getPromotionBySlug
}
