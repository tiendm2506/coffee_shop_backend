import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from '../constant/app.constant.js'
import { userModel } from '@/models/user.model.js'
import { UnauthorizedException } from '../helpers/error.helper.js'

export const protect = async(req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (!accessToken) throw new UnauthorizedException('Please provide your token')
  const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)
  const user = await userModel.findUserById(decode.userId)
  req.user = user
  next()
}
