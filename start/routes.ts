import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'

router.post('signup', [UsersController, 'signup'])
router.post('login', [UsersController, 'login'])

router
  .get('/', async ({ auth }) => {
    return auth.getUserOrFail()
  })
  .use(middleware.auth())

router.post('register', async ({ request }) => {
  const user = await User.create(request.all())
  return user
})
