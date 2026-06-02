import { orderModel } from '@/models/order.model.js'
import { productModel } from '@/models/product.model.js'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '../utils/constant.utils.js'
import { BadRequestException } from '../common/helpers/error.helper.js'
import { ORDER_STATUS } from '../utils/constant.utils.js'
import { getIO } from '../socket.js'

const createNew = async (reqBody) => {
  try {
    // Check empty cart
    if (!reqBody.items || reqBody.items.length === 0) {
      throw new BadRequestException('Order must have at least 1 item')
    }

    // check product amount in stock
    for (const item of reqBody.items) {
      const product = await productModel.findOneById(item.product_id)
      if (!product) {
        throw new BadRequestException('Product not found')
      }
      if (product.amount_in_stock < item.quantity) {
        throw new BadRequestException(
          `${product.name} only has ${product.amount_in_stock} stock`
        )
      }
    }

    const total_items = reqBody.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
    const total_price = reqBody.items.reduce(
      (sum, item) => sum + item.final_price * item.quantity,
      0
    )
    const final_total = total_price - (reqBody.discount || 0)
    const orderData = {
      ...reqBody,
      total_items,
      total_price,
      final_total,
      order_status: ORDER_STATUS.NEW,
      createdAt: Date.now(),
      updatedAt: null
    }

    // loop items in cart and decrease amount in stock for each item
    for (const item of reqBody.items) {
      await productModel.updateAmountInStock(
        item.product_id,
        -item.quantity
      )
    }

    const result = await orderModel.createNew(orderData)

    // emit noti new order realtime
    getIO().to('admin_room').emit('new_order', {
      message: 'New order',
      result
    })

    return result

  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (orderId) => {
  try {
    const order = await orderModel.findOneById(orderId)
    if (!order) {
      throw new BadRequestException('Order not found')
    }

    // Update amount in stock if order_status = NEW
    if (order.order_status === ORDER_STATUS.NEW) {
      await Promise.all(
        order.items.map(item =>
          productModel.updateAmountInStock(
            item.product_id,
            item.quantity
          )
        )
      )
    }

    const result = await orderModel.remove(orderId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (orderId, reqBody) => {
  const order = await orderModel.findOneById(orderId)
  const oldStatus = order.order_status
  const newStatus = reqBody.order_status
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    // change status from Complete/New to Cancel => increase amount in stock
    if ([ORDER_STATUS.NEW, ORDER_STATUS.COMPLETE].includes(oldStatus) && newStatus === ORDER_STATUS.CANCEL ) {
      for (const item of order.items) {
        await productModel.updateAmountInStock(
          item.product_id,
          item.quantity
        )
      }
    }

    // change status from Cancel to Complete/New => decrease amount in stock
    if (oldStatus === ORDER_STATUS.CANCEL && [ORDER_STATUS.NEW, ORDER_STATUS.COMPLETE].includes(newStatus)) {
      for (const item of order.items) {
        await productModel.updateAmountInStock(
          item.product_id,
          -item.quantity
        )
      }
    }

    const updatedOrder = await orderModel.update(orderId, updateData)
    return updatedOrder
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async (page, limit, queryFilters) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!limit) limit = DEFAULT_ITEMS_PER_PAGE
    const data = await orderModel.getList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      queryFilters
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

export const orderService = {
  createNew,
  remove,
  update,
  getList
}
