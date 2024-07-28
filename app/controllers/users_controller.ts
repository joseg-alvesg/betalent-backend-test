import User from '#models/user'
import { storeUserValidation } from '#validators/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async signup({ request, response }: HttpContext) {
    try {
      const { email, password } = request.all()
      await storeUserValidation.validate({ email, password })
      const userExists = await User.findBy('email', email)
      if (userExists) {
        return response.status(400).json({ message: 'User already exists' })
      }

      const user = await User.create({ email, password })
      return user
    } catch (error) {
      return response.status(500).json(error)
    }
  }
  async login({ request, auth, response }: HttpContext) {
    try {
      const { email, password } = request.all()
      await storeUserValidation.validate({ email, password })
      const user = await User.verifyCredentials(email, password)
      // WARN: 1. Property 'generate' does not exist on type 'never'. [2339] but it should work fine
      // @ts-ignore
      return await auth.use('jwt').generate(user)
    } catch (error) {
      return response
        .status(error.status || 500)
        .json(error.messages ? { ...error.messages[0] } : error)
    }
  }
}
