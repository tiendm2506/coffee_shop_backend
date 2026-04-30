import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '@/config/db.js'
import { BadRequestException } from '@/common/helpers/error.helper.js'
import bcrypt from 'bcrypt'

const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  avatar: Joi.string().optional(),
  role: Joi.string().valid('user', 'admin').default('user'),
  isActive: Joi.boolean().default(true),
  isVerified: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const register = async (data) => {
  try {
    const existingUser = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: data.email.toLowerCase().trim() })
    if (existingUser) throw new BadRequestException('Email already exists')

    const validatedData = await validateBeforeCreate(data)
    const newUserToAdd = {
      ...validatedData,
      password: bcrypt.hashSync(validatedData.password, 10)
    }
    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(newUserToAdd)
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: result.insertedId })
    delete createdUser.password
    return createdUser
  } catch (error) {
    throw new BadRequestException(error.message)
  }
}

const findUserByEmail = async (email) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
}
const findUserById = async (id) => {
  return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

export const userModel = {
  register,
  findUserByEmail,
  findUserById
}

