import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { promotionController } from '../controllers/promotion.controller.js'

const promotionRouter = express.Router()

promotionRouter.post('/create', protect, promotionController.createNew)
promotionRouter.get('/list', promotionController.getList)
promotionRouter.put('/update/:id', protect, promotionController.update)
promotionRouter.delete('/remove/:id', protect, promotionController.remove)
promotionRouter.post('/check', promotionController.checkPromotionCode)
promotionRouter.post('/subscribe', promotionController.subscribe)

export default promotionRouter