import vine from '@vinejs/vine'

export const storeProductValidation = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().minLength(3),
    price: vine.number().decimal([0, 2]),
  })
)

export const updateProductValidation = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    description: vine.string().trim().minLength(3).optional(),
    price: vine.number().decimal([0, 2]).optional(),
  })
)
