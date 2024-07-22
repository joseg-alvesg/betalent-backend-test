import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import Phone from '#models/phone'
import Adress from '#models/address'
import { inject } from '@adonisjs/core'

@inject()
export default class ClientsController {
  async index() {
    const clients = await Client.query()
      .select('id', 'name')
      .preload('phones', (phonesQuery) => {
        phonesQuery.select('phone')
      })
      .preload('address', (addressQuery) => {
        addressQuery.select('state')
      })
      .orderBy('id')

    return clients
  }

  async show({ params }: HttpContext) {
    return Client.findOrFail(params.id)
  }

  async store({ request, response }: HttpContext) {
    const { client, phone, address } = request.all()
    // if (!name || !cpf) {
    //   throw new Error('Name and CPF are required')
    // }

    const clientReq = await Client.create({ ...client })
    const phoneReq = await Phone.create({ ...phone, clientId: clientReq.id })
    const addressReq = await Adress.create({ ...address, clientId: clientReq.id })

    return response.status(201).json({ clientReq, phoneReq, addressReq })
  }

  async update({ request, params }: HttpContext) {
    const { client, phone, address } = request.all()

    try {
      if (client) {
        const clientReq = await Client.findOrFail(params.id)
        clientReq.merge(client).save()
      }
      if (phone) {
        // NOTE: the phone needs to be improved for multiple phones
        const phoneReq = await Phone.findByOrFail('clientId', params.id)
        phoneReq.merge(phone).save()
      }
      if (address) {
        const addressReq = await Adress.findByOrFail('clientId', params.id)
        addressReq.merge(address).save()
      }

      return 'Client updated'
    } catch (error) {
      throw new Error('Client not found')
    }
  }

  async delete({ params }: HttpContext) {
    const client = await Client.findOrFail(params.id)
    await client.delete()
    return 'Client deleted'
  }
}
