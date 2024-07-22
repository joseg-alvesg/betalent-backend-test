import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index() {
    return Product.query().select('id', 'name', 'price').orderBy('id')
  }

  async show({ params }: HttpContext) {
    return Product.findOrFail(params.id)
  }

  async store({ request }: HttpContext) {
    // TODO: add validation
    return await Product.create({ ...request.all() })
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
