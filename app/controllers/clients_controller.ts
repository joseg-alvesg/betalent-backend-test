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
  async show({ params, response, request }: HttpContext) {
    const { month, year } = request.qs()

    const client = Client.find(params.id)
    if (!client) {
      return response.status(404).json({ message: 'Client not found' })
    }
    if (month && year) {
      if (month < 1 || month > 12) {
        return response.status(400).json({ message: 'Invalid month' })
      }

      return Client.query()
        .where('id', params.id)
        .preload('sales', (salesQuery) => {
          salesQuery
            .select('id', 'quantity', 'total_price', 'created_at')
            .whereRaw('extract(month from created_at) = ?', [month])
            .whereRaw('extract(year from created_at) = ?', [year])
            .orderBy('created_at', 'desc')
        })
        .first()
    }
    return Client.query()
      .where('id', params.id)
      .preload('sales', (salesQuery) => {
        salesQuery
          .select('id', 'quantity', 'total_price', 'created_at')
          .orderBy('created_at', 'desc')
      })
  }

  async store({ request, response }: HttpContext) {
    const { client, phone, address } = request.all()
    if (!client.name || !client.cpf) {
      return response.status(400).json({ message: 'Name and CPF are required' })
    }
    if (!phone.phone) {
      return response.status(400).json({ message: 'Phone is required' })
    }
    if (
      !address.state ||
      !address.city ||
      !address.neighborhood ||
      !address.street ||
      !address.number ||
      !address.zipCode
    ) {
      return response
        .status(400)
        .json({ message: 'State, city, neighborhood, street, number and zip code are required' })
    }

    const clientReq = await Client.create({ ...client })
    const phoneReq = await Phone.create({ ...phone, clientId: clientReq.id })
    const addressReq = await Adress.create({ ...address, clientId: clientReq.id })

    return response.status(201).json({ clientReq, phoneReq, addressReq })
  }

  async update({ request, params, response }: HttpContext) {
    const { client, phone, address } = request.all()

    try {
      if (client) {
        const clientReq = await Client.find(params.id)
        if (!clientReq) {
          return response.status(404).json({ message: 'Client not found' })
        }
        clientReq.merge(client).save()
      }
      if (phone) {
        // NOTE: the phone needs to be improved for multiple phones
        const phoneReq = await Phone.find('clientId', params.id)
        if (!phoneReq) {
          return response.status(404).json({ message: 'Phone not found' })
        }
        phoneReq.merge(phone).save()
      }
      if (address) {
        const addressReq = await Adress.find('clientId', params.id)
        if (!addressReq) {
          return response.status(404).json({ message: 'Address not found' })
        }
        addressReq.merge(address).save()
      }

      return response.status(200).json({ message: 'Client updated' })
    } catch (error) {
      throw new Error('Client not found')
    }
  }

  async delete({ params, response }: HttpContext) {
    const client = await Client.find(params.id)
    if (!client) {
      return response.status(404).json({ message: 'Client not found' })
    }
    await client.delete()
    return 'Client deleted'
  }
}
