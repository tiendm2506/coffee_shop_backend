import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { postController } from '../controllers/post.controller.js'

const postRouter = express.Router()

postRouter.post('/create', protect, postController.createNew)
postRouter.get('/list', postController.getList)
postRouter.put('/update/:id', postController.update)
postRouter.delete('/remove/:id', protect, postController.remove)
postRouter.get('/detail/:id', postController.getDetailById)
postRouter.get('/:slug', postController.getDetailBySlug)

export default postRouter