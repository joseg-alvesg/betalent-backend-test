import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Client from '#models/client'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'

export default class Sale extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare clientId: number

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @column()
  declare productId: number

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column()
  declare quantity: number

  @column()
  declare unitPrice: number

  @column()
  declare totalPrice: number
}
