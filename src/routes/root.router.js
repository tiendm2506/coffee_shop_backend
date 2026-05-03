import express from 'express'
import swaggerUi from 'swagger-ui-express'
import productRouter from './product.router.js'
import categoryRouter from './category.router.js'
import userRouter from './user.router.js'
import uploadRouter from './upload.route.js'
import promotionRouter from './promotion.router.js'
import swaggerDocument from '@/common/swagger/init.swagger.js'

const rootRouter = express.Router()

rootRouter.use('/api-docs', swaggerUi.serve)
rootRouter.get('/api-docs', swaggerUi.setup(swaggerDocument, { swaggerOptions: { persistAuthorization: true } }))

rootRouter.use('/api/product', productRouter)
rootRouter.use('/api/category', categoryRouter)
rootRouter.use('/api/promotion', promotionRouter)
rootRouter.use('/api/user', userRouter)
rootRouter.use('/api', uploadRouter)

export default rootRouter