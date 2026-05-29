import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { orderController } from '../controllers/order.controller.js'

const orderRouter = express.Router()

orderRouter.post('/create', orderController.createNew)
orderRouter.get('/list', orderController.getList)
orderRouter.put('/update/:id', protect, orderController.update)
orderRouter.delete('/remove/:id', protect, orderController.remove)

export default orderRouter