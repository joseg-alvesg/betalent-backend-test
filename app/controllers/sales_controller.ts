import type { HttpContext } from '@adonisjs/core/http'
import Sale from '#models/sale'

export default class SalesController {
  async store({ request }: HttpContext) {
    // TODO: add validation
    return await Sale.create({ ...request.all() })
  }
}
