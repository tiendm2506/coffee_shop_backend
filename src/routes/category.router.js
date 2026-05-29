import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { categoryController } from '../controllers/category.controller.js'

const categoryRouter = express.Router()

categoryRouter.post('/create', protect, categoryController.createNew)
categoryRouter.get('/list', categoryController.getList)
categoryRouter.put('/update/:id', protect, categoryController.update)
categoryRouter.delete('/remove/:id', protect, categoryController.remove)

export default categoryRouter