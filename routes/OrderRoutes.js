import { addOrder ,editOrder , deleteOrder, getAllOrders , getOrderById } from '../controllers/OrderController.js'
import express from 'express'

const orderRouter = express.Router()

orderRouter.post('/', addOrder)
orderRouter.patch('/', editOrder)
orderRouter.delete('/', deleteOrder)
orderRouter.get('/', getAllOrders)
orderRouter.post('/byId', getOrderById)

export default orderRouter