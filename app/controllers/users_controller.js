// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async signup({ request }) {
    const user = await User.create(request.all())
    return user
  }
  async login({ request, auth }) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)
    return await auth.use('jwt').generate(user)
  }
}
