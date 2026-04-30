import { StatusCodes } from 'http-status-codes'

export const responseSuccess = (metaData = null, message = 'OK', code = StatusCodes.OK) => {
  if (typeof code !== 'number') code = StatusCodes.OK
  return {
    success: true,
    code: code,
    message: message,
    metaData: metaData,
    doc: 'api.domain.com/docs'
  }
}

export const responseError = (message = 'Internal Server Error', code = StatusCodes.INTERNAL_SERVER_ERROR, stack = null) => {
  if (typeof code !== 'number') code = StatusCodes.INTERNAL_SERVER_ERROR
  return {
    success: false,
    code: code,
    message: message,
    stack: stack
  }
}