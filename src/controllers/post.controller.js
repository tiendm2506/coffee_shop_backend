import { StatusCodes } from 'http-status-codes'
import { responseSuccess } from '@/common/helpers/response.helper.js'
import { ObjectId } from 'mongodb'
import { postService } from '../services/post.service.js'

const createNew = async (req, res, next) => {
  try {
    const result = await postService.createNew(req.body)
    const response = responseSuccess(result, 'Create post successfully', StatusCodes.CREATED)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

const getList = async (req, res, next) => {
  try {
    const { page, limit, q, ...rest } = req.query
    const queryFilters = { ...rest, q }
    const posts = await postService.getList(page, limit, queryFilters)
    const resData = responseSuccess(posts, 'Get all posts successfully')
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const postId = req.params.id
    const { ...updateFields } = req.body

    if (!postId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Post ID is can not be empty'
      })
    }

    if (!ObjectId.isValid(postId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Post ID is invalid'
      })
    }

    const updateData = { ...updateFields }

    const updatedPost = await postService.update(postId, updateData)
    const resData = responseSuccess(updatedPost, 'Post updated successfully')
    res.status(resData.code).json(resData)
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const postId = req.params.id

    if (!ObjectId.isValid(postId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Post ID is invalid'
      })
    }

    const result = await postService.remove(postId)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: 'Post not found'
      })
    }

    const resData = responseSuccess(result, 'Post removed successfully')
    res.status(resData.code).json(resData)

  } catch (error) {
    next(error)
  }
}

const getDetailBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const result = await postService.getDetailBySlug(slug)
    const resData = responseSuccess(result, 'Get post detail successfully')
    res.status(resData.code).json(resData)

  } catch (error) {
    next(error)
  }
}
const getDetailById = async (req, res, next) => {
  try {
    const result = await postService.getDetailById(req.params.id)
    const resData = responseSuccess(result, 'Get post detail successfully')
    res.status(resData.code).json(resData)
  } catch (error) {
    next(error)
  }
}


export const postController = {
  createNew,
  getList,
  update,
  remove,
  getDetailBySlug,
  getDetailById
}