import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import Phone from '#models/phone'
import Adress from '#models/address'
import { inject } from '@adonisjs/core'
import { storeClientValidation, updateClientValidation } from '#validators/client'

@inject()
export default class ClientsController {
  async index({ response }: HttpContext) {
    try {
      // NOTE: search if it's possible to lucid not reurn the join attributes
      // in the $extras property and return it in the main object
      const clients = await Client.query()
        .from('clients')
        .join('phones', 'clients.id', 'phones.client_id')
        .join('addresses', 'clients.id', 'addresses.client_id')
        .select('clients.id', 'clients.name', 'phones.phone', 'addresses.state')
        .orderBy('clients.id')

      // WARN: maybe a map is not the best option here because of the amount of data
      // but for now it is ok
      return response.json(
        clients.map((client) => {
          return {
            id: client.id,
            name: client.name,
            phone: client.$extras.phone,
            state: client.$extras.state,
          }
        })
      )
    } catch (error) {
      return error
      return response.status(500).json({ message: 'Internal server error (index)' })
    }
  }
  async show({ params, response, request }: HttpContext) {
    try {
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
        .first()
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const {
        name,
        cpf,
        phone,
        state,
        city,
        neighborhood,
        street,
        streetNumber,
        zipCode,
        complement,
      } = request.all()
      await storeClientValidation.validate(request.all())

      const clientExists = await Client.findBy('cpf', cpf)
      if (clientExists) {
        return response.status(400).json({ message: 'Client already exists' })
      }

      const phoneExists = await Phone.findBy('phone', phone)
      if (phoneExists) {
        return response.status(400).json({ message: 'Phone already exists' })
      }

      const clientReq = await Client.create({ name, cpf })
      const phoneReq = await Phone.create({
        phone,
        clientId: clientReq.id,
      })
      const addressReq = await Adress.create({
        state,
        city,
        neighborhood,
        street,
        streetNumber,
        zipCode,
        complement,
        clientId: clientReq.id,
      })

      return response.status(201).json({ client: clientReq, phone: phoneReq, address: addressReq })
    } catch (error) {
      return response
        .status(error.status || 500)
        .json(error.messages ? { ...error.messages[0] } : error)
    }
  }

  async update({ request, params, response }: HttpContext) {
    const {
      name,
      cpf,
      phone,
      state,
      city,
      neighborhood,
      street,
      streetNumber,
      zipCode,
      complement,
    } = request.all()
    try {
      const payload = await updateClientValidation.validate(request.all())
      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: 'At least one field is required' })
      }
      if (name || cpf) {
        const clientReq = await Client.find(params.id)
        if (!clientReq) {
          return response.status(404).json({ message: 'Client not found' })
        }
        clientReq.merge({ name, cpf }).save()
      }
      if (phone) {
        // NOTE: the phone needs to be improved for multiple phones
        const phoneReq = await Phone.findBy('client_id', params.id)
        if (!phoneReq) {
          return response.status(404).json({ message: 'Phone not found' })
        }
        phoneReq.merge({ phone }).save()
      }
      if (state || city || neighborhood || street || streetNumber || zipCode || complement) {
        const addressReq = await Adress.findBy('client_id', params.id)
        if (!addressReq) {
          return response.status(404).json({ message: 'Address not found' })
        }
        addressReq
          .merge({ state, city, neighborhood, street, streetNumber, zipCode, complement })
          .save()
      }

      return response.status(200).json({ message: 'Client updated' })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete({ params, response }: HttpContext) {
    try {
      const client = await Client.find(params.id)
      if (!client) {
        return response.status(404).json({ message: 'Client not found' })
      }

      await client.delete()
      return response.status(200).json({ message: 'Client deleted' })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
}
