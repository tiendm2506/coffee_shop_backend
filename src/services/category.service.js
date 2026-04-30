import { categoryModel } from '../models/category.model.js'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '../utils/constant.utils.js'

const createNew = async (reqBody) => {
  try {
    const result = await categoryModel.createNew(reqBody)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async (page, limit, type) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!limit) limit = DEFAULT_ITEMS_PER_PAGE
    const data = await categoryModel.getList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      type
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (categoryId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
      completedAt: !!reqBody?.status ? Date.now() : null
    }
    const updatedCategory = await categoryModel.update(categoryId, updateData)
    return updatedCategory
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (categoryId) => {
  try {
    const result = await categoryModel.remove(categoryId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}


export const categoryService = {
  createNew,
  getList,
  update,
  remove
}
