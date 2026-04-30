import { StatusCodes } from 'http-status-codes'
import { responseSuccess } from '@/common/helpers/response.helper.js'
import { userService } from '@/services/user.service'

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body)
    const response = responseSuccess(result, 'Register user successfully', StatusCodes.OK)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    const response = responseSuccess(result, 'User login successfully', StatusCodes.OK)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req)
    const response = responseSuccess(result, 'Refresh token successfully', StatusCodes.OK)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

export const userController = {
  register,
  login,
  refreshToken
}