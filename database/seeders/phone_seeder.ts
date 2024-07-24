import Phone from '#models/phone'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development']
  async run() {
    await Phone.createMany([
      {
        phone: '123456789',
        clientId: 1,
      },
      {
        phone: '987654321',
        clientId: 2,
      },
    ])
  }
}
