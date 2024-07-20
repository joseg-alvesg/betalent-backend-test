import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async signup({ request }: HttpContext) {
    const user = await User.create(request.all())
    return user
  }
  async login({ request, auth }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)
    return await auth.use('jwt').generate(user)
  }
}
