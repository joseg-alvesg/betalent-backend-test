import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development']
  async run() {
    await User.createMany([
      {
        email: 'email1@gmail.com',
        password: '123456',
      },
      {
        email: 'email2@yahoo.com',
        password: '654321',
      },
    ])
  }
}
