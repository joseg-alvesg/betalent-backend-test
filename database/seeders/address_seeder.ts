import Address from '#models/address'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development']
  async run() {
    await Address.createMany([
      {
        street: 'Rua 1',
        streetNumber: '123',
        neighborhood: 'Bairro 1',
        city: 'Cidade 1',
        state: 'Estado 1',
        zipCode: '12345-678',
        clientId: 1,
      },
      {
        street: 'Rua 2',
        streetNumber: '456',
        complement: 'Apartamento',
        neighborhood: 'Bairro 2',
        city: 'Cidade 2',
        state: 'Estado 2',
        zipCode: '23456-789',
        clientId: 2,
      },
    ])
  }
}
