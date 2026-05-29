import jwt from 'jsonwebtoken'

import { ForbiddenException, UnauthorizedException } from '@/common/helpers/error.helper.js'
import { ACCESS_TOKEN_SECRET } from '@/common/constant/app.constant.js'
import { USER_ROLE } from '../utils/constant.utils.js'

const verifyToken = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization
    if (!bearerToken) {
      throw new UnauthorizedException('Access token is required')
    }
    const accessToken = bearerToken.split(' ')[1]
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    next(new UnauthorizedException('Invalid access token'))
  }
}

const verifyAdmin = (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('Admin access required')
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const authMiddleware = {
  verifyToken,
  verifyAdmin
}

