import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { responseError } from './response.helper.js'

export const handleError = (error, req, res, next) => {
  if (error instanceof jwt.JsonWebTokenError) {
    error.code = StatusCodes.UNAUTHORIZED // logout user if token is invalid
  }
  if (error instanceof jwt.TokenExpiredError) {
    error.code = StatusCodes.FORBIDDEN // logout user if token is expired
  }
  const resData = responseError(error.message, error.code, error.stack)
  res.status(resData.code).json(resData)
}

export class BadRequestException extends Error {
  constructor(message = 'BadRequestException') {
    super(message)
    this.code = StatusCodes.BAD_REQUEST
  }
}

export class ForbiddenException extends Error {
  constructor(message = 'ForbiddenException') {
    super(message)
    this.code = StatusCodes.FORBIDDEN
  }
}

export class UnauthorizedException extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.code = StatusCodes.UNAUTHORIZED
  }
}