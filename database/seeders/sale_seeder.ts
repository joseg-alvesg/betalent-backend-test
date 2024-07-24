import Sale from '#models/sale'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development']
  async run() {
    await Sale.createMany([
      {
        clientId: 1,
        productId: 1,
        quantity: 3,
        unitPrice: 10,
        totalPrice: 30,
      },
      {
        clientId: 2,
        productId: 1,
        quantity: 2,
        unitPrice: 20,
        totalPrice: 40,
      },
    ])
  }
}
