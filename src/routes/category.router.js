import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { categoryController } from '../controllers/category.controller.js'

const categoryRouter = express.Router()

categoryRouter.post('/create', categoryController.createNew)
categoryRouter.get('/list', categoryController.getList)
categoryRouter.put('/update/:id', categoryController.update)
categoryRouter.delete('/remove/:id', categoryController.remove)

export default categoryRouter