import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
import ClientsController from '#controllers/clients_controller'
import ProductsController from '#controllers/products_controller'

router.post('signup', [UsersController, 'signup'])
router.post('login', [UsersController, 'login'])
// router.post('client/store', [ClientsController, 'store']).use(middleware.auth())

router
  .group(() => {
    router.resource('clients', ClientsController).apiOnly().except(['destroy', 'update'])
    router.put('clients/:id', [ClientsController, 'update'])
    router.delete('clients/:id', [ClientsController, 'delete'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.resource('products', ProductsController).apiOnly().except(['destroy', 'update'])
    router.put('products/:id', [ProductsController, 'update'])
    router.delete('products/:id', [ProductsController, 'delete'])
  })
  .use(middleware.auth())
