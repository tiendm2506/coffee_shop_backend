import { userModel } from '@/models/user.model.js'
import { BadRequestException, UnauthorizedException } from '@/common/helpers/error.helper.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_EXPIRED, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRED, REFRESH_TOKEN_SECRET } from '@/common/constant/app.constant'


const register = async (reqBody) => {
  try {
    const result = await userModel.register(reqBody)
    return result
  } catch (error) {
    throw new BadRequestException(error.message)
  }
}

const login = async (reqBody) => {
  try {
    const { email, password } = reqBody
    const existingUser = await userModel.findUserByEmail(email)
    if (!existingUser) throw new BadRequestException('Email not exist.')
    const isMatch = await bcrypt.compare(password, existingUser.password)
    if (!isMatch) throw new BadRequestException('Invalid email or password.')
    const tokens = createTokens(existingUser)
    return {
      ...tokens,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
      }
    }
  } catch (error) {
    throw new BadRequestException(error.message)
  }
}

const refreshToken = async(req) => {
  const refreshToken = req.headers.authorization?.split(' ')[1]

  if (!refreshToken) {
    throw new UnauthorizedException('Refresh token is required')
  }

  const decoded = jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET
  )

  const existingUser = await userModel.findUserById(decoded.userId)

  if (!existingUser) {
    throw new UnauthorizedException('User not found')
  }

  const tokens = createTokens(existingUser)

  return tokens
}

const createTokens = (user) => {
  if (!user._id) throw new BadRequestException('User ID is required to create tokens')

  const payload = {
    userId: user._id,
    role: user.role
  }

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRED })
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRED })

  return { accessToken, refreshToken }
}

export const userService = {
  register,
  login,
  refreshToken
}