import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index() {
    return Product.query().select('id', 'name', 'price').orderBy('id')
  }

  async show({ params, response }: HttpContext) {
    const product = Product.find(params.id)
    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }
    return product
  }

  async store({ request, response }: HttpContext) {
    const { name, description, price } = request.all()
    if (!name || !description || !price) {
      return response.status(400).json({ message: 'Name, description and price are required' })
    }
    const productExists = await Product.findBy('name', name)
    if (productExists) {
      return response.status(400).json({ message: 'Product already exists' })
    }

    return await Product.create({ name, description, price })
  }

  async update({ request, params }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    // TODO: add validation
    product.merge(request.all()).save()
    return product
  }

  async delete({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    product.isDeleted = true
    product.save()
    return product
  }
}
