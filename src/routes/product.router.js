import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { productController } from '../controllers/product.controller.js'

const productRouter = express.Router()

productRouter.post('/create', productController.createNew)
productRouter.get('/list', productController.getList)
productRouter.put('/update/:id', productController.update)
productRouter.delete('/remove/:id', productController.remove)
productRouter.get('/:slug', productController.getProductBySlug)

export default productRouter