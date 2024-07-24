import Client from '#models/client'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development']
  async run() {
    await Client.createMany([
      {
        name: 'Client 1',
        cpf: '123123123123',
      },
      {
        name: 'Client 2',
        cpf: '456456456456',
      },
    ])
  }
}
