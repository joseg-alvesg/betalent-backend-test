import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class IndexSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in a environment specified in Seeder
     */
    if (
      !Seeder.default.environment ||
      (!Seeder.default.environment.includes('development') && app.inDev) ||
      (!Seeder.default.environment.includes('testing') && app.inTest) ||
      (!Seeder.default.environment.includes('production') && app.inProduction)
    ) {
      console.log('Skipping seeder', Seeder.default.environment)
      return
    }

    await new Seeder.default(this.client).run()
  }

  async run() {
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/client_seeder'))
    await this.seed(await import('#database/seeders/phone_seeder'))
    await this.seed(await import('#database/seeders/address_seeder'))
    await this.seed(await import('#database/seeders/product_seeder'))
    await this.seed(await import('#database/seeders/sale_seeder'))
  }
}
