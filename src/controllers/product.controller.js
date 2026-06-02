import { StatusCodes } from 'http-status-codes'
import { responseSuccess } from '@/common/helpers/response.helper.js'
import { ObjectId } from 'mongodb'
import { productService } from '../services/product.service.js'

const createNew = async (req, res, next) => {
  try {
    const result = await productService.createNew(req.body)
    const response = responseSuccess(result, 'Create product successfully', StatusCodes.CREATED)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

const getList = async (req, res, next) => {
  try {
    const { page, limit, q, ...rest } = req.query
    const queryFilters = { ...rest, q }
    const products = await productService.getList(page, limit, queryFilters)
    const resData = responseSuccess(products, 'Get all products successfully')
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const productId = req.params.id
    const { ...updateFields } = req.body

    if (!productId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Product ID is can not be empty'
      })
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Product ID is invalid'
      })
    }

    const updateData = { ...updateFields }

    const updatedProduct = await productService.update(productId, updateData)
    const resData = responseSuccess(updatedProduct, 'Product updated successfully')
    res.status(resData.code).json(resData)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const productId = req.params.id

    if (!ObjectId.isValid(productId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Product ID is invalid'
      })
    }

    const result = await productService.remove(productId)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: 'Product not found'
      })
    }

    const resData = responseSuccess(result, 'Product removed successfully')
    res.status(resData.code).json(resData)

  } catch (error) {
    next(error)
  }
}

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req, res)
    const resData = responseSuccess(product, 'Get product detail successfully')
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}

const getBestSellingProduct = async (req, res, next) => {
  try {
    const { limit = 3 } = req.query
    const products = await productService.getBestSellingProduct(Number(limit))
    const resData = responseSuccess(products, 'Get best selling product successfully')
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}

export const productController = {
  createNew,
  getList,
  update,
  remove,
  getProductBySlug,
  getBestSellingProduct
}