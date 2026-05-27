import { postModel } from '../models/post.model.js'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '../utils/constant.utils.js'
import { extractImageUrls } from '../helpers/string.helper.js'
import { uploadService } from './upload.service'

const createNew = async (reqBody) => {
  try {
    const result = await postModel.createNew(reqBody)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async (page, limit, queryFilters) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!limit) limit = DEFAULT_ITEMS_PER_PAGE
    const data = await postModel.getList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      queryFilters
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (postId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedpost = await postModel.update(postId, updateData)
    return updatedpost
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (postId) => {
  try {
    const post = await postModel.findOneById(postId)
    if (!post) {
      throw new Error('Post not found')
    }
    // delete thumbnail
    if (post.thumbnail?.url) {
      await uploadService.deleteImageByUrl(
        post.thumbnail.url
      )
    }

    // delete content images
    const imageUrls = extractImageUrls(
      post.content
    )
    await Promise.all(
      imageUrls.map((url) =>
        uploadService.deleteImageByUrl(url)
      )
    )
    return await postModel.remove(postId)
  } catch (error) {
    throw error
  }
}

const getDetailBySlug = async (slug) => {
  try {
    return await postModel.getDetailBySlug(slug)
  } catch (error) {
    throw error
  }
}

const getDetailById = async (id) => {
  try {
    return await postModel.getDetailById(id)
  } catch (error) {
    throw error
  }
}

export const postService = {
  createNew,
  getList,
  update,
  remove,
  getDetailBySlug,
  getDetailById
}
