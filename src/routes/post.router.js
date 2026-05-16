import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { postController } from '../controllers/post.controller.js'

const postRouter = express.Router()

postRouter.post('/create', postController.createNew)
postRouter.get('/list', postController.getList)
postRouter.put('/update/:id', postController.update)
postRouter.delete('/remove/:id', postController.remove)
postRouter.get('/detail/:id', postController.getDetailById)
postRouter.get('/:slug', postController.getDetailBySlug)

export default postRouter