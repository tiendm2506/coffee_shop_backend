import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { promotionController } from '../controllers/promotion.controller.js'

const promotionRouter = express.Router()

promotionRouter.post('/create', promotionController.createNew)
promotionRouter.get('/list', promotionController.getList)
promotionRouter.put('/update/:id', promotionController.update)
promotionRouter.delete('/remove/:id', promotionController.remove)
promotionRouter.get('/:slug', promotionController.getpromotionBySlug)

export default promotionRouter