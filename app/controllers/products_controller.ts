import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ response }: HttpContext) {
    try {
      // NOTE: need to know if is better to show deleted products or not
      // same question for method show
      // return Product.query().select('id', 'name', 'price').where('isDeleted', false).orderBy('name')
      return Product.query().select('id', 'name', 'price').orderBy('name')
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const product = Product.find(params.id)
      if (!product) {
        return response.status(404).json({ message: 'Product not found' })
      }
      return product
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const { name, description, price } = request.all()
      if (!name || !description || !price) {
        return response.status(400).json({ message: 'Name, description and price are required' })
      }
      const productExists = await Product.findBy('name', name)
      if (productExists) {
        return response.status(400).json({ message: 'Product already exists' })
      }

      return response.status(201).json(await Product.create({ name, description, price }))
    } catch (error) {
      // console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  async update({ request, params, response }: HttpContext) {
    const { name, description, price } = request.all()
    if (!name && !description && !price) {
      return response.status(400).json({ message: 'Name, description or price are required' })
    }
    try {
      const product = await Product.find(params.id)
      if (!product) {
        return response.status(404).json({ message: 'Product not found' })
      }
      product.merge({ name, description, price }).save()
      return response.status(200).json({ message: 'Product updated' })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete({ params, response }: HttpContext) {
    try {
      const product = await Product.find(params.id)
      if (!product) {
        return { message: 'Product not found' }
      }
      product.isDeleted = true
      product.save()
      return response.status(200).json({ message: 'Product deleted' })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
}
