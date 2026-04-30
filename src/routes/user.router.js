import express from 'express'
import { userController } from '@/controllers/user.controller.js'

const userRouter = express.Router()

userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.post('/refresh-token', userController.refreshToken)

export default userRouter