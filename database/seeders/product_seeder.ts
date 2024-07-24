import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development']
  async run() {
    await Product.createMany([
      {
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
      },
      {
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        isDeleted: true,
      },
    ])
  }
}
