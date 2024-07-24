import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async signup({ request, response }: HttpContext) {
    try {
      const user = await User.create(request.all())
      return user
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
  async login({ request, auth, response }: HttpContext) {
    try {
      const { email, password } = request.all()
      const user = await User.verifyCredentials(email, password)
      // WARN: 1. Property 'generate' does not exist on type 'never'. [2339] but it should work fine
      // @ts-ignore
      return await auth.use('jwt').generate(user)
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
}
