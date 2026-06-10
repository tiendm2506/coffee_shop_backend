import express from 'express'
import swaggerUi from 'swagger-ui-express'

import productRouter from './product.router.js'
import categoryRouter from './category.router.js'
import promotionRouter from './promotion.router.js'
import orderRouter from './order.router.js'
import userRouter from './user.router.js'
import uploadRouter from './upload.route.js'
import clientRouter from './client.router.js'
import postRouter from './post.router.js'
import healthRouter from './health.router.js'

import swaggerDocument from '@/common/swagger/init.swagger.js'

const rootRouter = express.Router()

rootRouter.use('/api-docs', swaggerUi.serve)
rootRouter.get('/api-docs', swaggerUi.setup(swaggerDocument, { swaggerOptions: { persistAuthorization: true } }))

rootRouter.use('/health', healthRouter)
rootRouter.use('/api/product', productRouter)
rootRouter.use('/api/category', categoryRouter)
rootRouter.use('/api/promotion', promotionRouter)
rootRouter.use('/api/order', orderRouter)
rootRouter.use('/api/user', userRouter)
rootRouter.use('/api/upload', uploadRouter)
rootRouter.use('/api/client', clientRouter)
rootRouter.use('/api/post', postRouter)

export default rootRouter