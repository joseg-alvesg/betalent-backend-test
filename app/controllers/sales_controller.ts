import type { HttpContext } from '@adonisjs/core/http'
import Sale from '#models/sale'
import Client from '#models/client'
import Product from '#models/product'

export default class SalesController {
  async store({ request, response }: HttpContext) {
    const { clientId, productId, quantity } = request.all()

    if (!clientId || !productId || !quantity) {
      return response.status(400).json({ message: 'Client, product and quantity are required' })
    }

    const client = await Client.find(clientId)

    if (!client) {
      return response.status(404).json({ message: 'Client not found' })
    }

    const product = await Product.find(productId)
    if (!product || product.isDeleted) {
      return response.status(404).json({ message: 'Product not found' })
    }

    const totalPrice = product.price * quantity

    return await Sale.create({
      clientId,
      productId,
      quantity,
      unitPrice: product.price,
      totalPrice,
    })
  }
}
