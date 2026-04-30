import { StatusCodes } from 'http-status-codes'
import { responseSuccess } from '@/common/helpers/response.helper.js'
import { ObjectId } from 'mongodb'
import { categoryService } from '../services/category.service.js'

const createNew = async (req, res, next) => {
  try {
    const result = await categoryService.createNew(req.body)
    const response = responseSuccess(result, 'Create category successfully', StatusCodes.CREATED)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

const getList = async (req, res, next) => {
  try {
    const { page, limit, type } = req.query
    const categories = await categoryService.getList(page, limit, type)
    const resData = responseSuccess(categories, `Get all ${type} categories successfully`)
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const taskId = req.params.id
    const { ...updateFields } = req.body

    if (!taskId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Task ID is can not be empty'
      })
    }

    if (!ObjectId.isValid(taskId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Task ID is invalid'
      })
    }

    const updateData = { ...updateFields }

    const updatedTask = await categoryService.update(taskId, updateData)
    const resData = responseSuccess(updatedTask, 'Task updated successfully')
    res.status(resData.code).json(resData)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const taskId = req.params.id

    if (!ObjectId.isValid(taskId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Task ID is invalid'
      })
    }

    const result = await categoryService.remove(taskId)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: 'Task not found'
      })
    }

    const resData = responseSuccess(result, 'Task removed successfully')
    res.status(resData.code).json(resData)

  } catch (error) {
    next(error)
  }
}


export const categoryController = {
  createNew,
  getList,
  update,
  remove
}