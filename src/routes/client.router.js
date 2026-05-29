import express from 'express'

import { protect } from '@/common/middlewares/protect.middleware.js'
import { clientController } from '../controllers/client.controller.js'

const clientRouter = express.Router()

clientRouter.post('/create', clientController.createNew)
clientRouter.get('/list', clientController.getList)
clientRouter.delete('/remove/:id', protect, clientController.remove)

export default clientRouter