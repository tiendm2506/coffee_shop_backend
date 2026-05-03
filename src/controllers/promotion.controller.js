import { StatusCodes } from 'http-status-codes'
import { responseSuccess } from '@/common/helpers/response.helper.js'
import { ObjectId } from 'mongodb'
import { promotionService } from '../services/promotion.service.js'

const createNew = async (req, res, next) => {
  try {
    const result = await promotionService.createNew(req.body)
    const response = responseSuccess(result, 'Create promotion successfully', StatusCodes.CREATED)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

const getList = async (req, res, next) => {
  try {
    const { page, limit, q, ...rest } = req.query
    const queryFilters = { ...rest, q }
    const promotions = await promotionService.getList(page, limit, queryFilters)
    const resData = responseSuccess(promotions, 'Get all promotions successfully')
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const promotionId = req.params.id
    const { ...updateFields } = req.body

    if (!promotionId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Promotion ID is can not be empty'
      })
    }

    if (!ObjectId.isValid(promotionId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Promotion ID is invalid'
      })
    }

    const updateData = { ...updateFields }

    const updatedpromotion = await promotionService.update(promotionId, updateData)
    const resData = responseSuccess(updatedpromotion, 'Promotion updated successfully')
    res.status(resData.code).json(resData)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const promotionId = req.params.id

    if (!ObjectId.isValid(promotionId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Promotion ID is invalid'
      })
    }

    const result = await promotionService.remove(promotionId)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: 'Promotion not found'
      })
    }

    const resData = responseSuccess(result, 'Promotion removed successfully')
    res.status(resData.code).json(resData)

  } catch (error) {
    next(error)
  }
}

const getpromotionBySlug = async (req, res, next) => {
  try {
    const promotion = await promotionService.getpromotionBySlug(req, res)
    const resData = responseSuccess(promotion, 'Get promotion detail successfully')
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}

export const promotionController = {
  createNew,
  getList,
  update,
  remove,
  getpromotionBySlug
}