import vine from '@vinejs/vine'

export const storeClientValidation = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    cpf: vine.string().fixedLength(11),
    phone: vine.string().mobile(),
    state: vine.string().trim().minLength(2),
    city: vine.string().trim().minLength(2),
    neighborhood: vine.string().trim().minLength(2),
    street: vine.string().trim().minLength(2),
    streetNumber: vine.string().trim().minLength(1),
    zipCode: vine.string().trim().minLength(4),
  })
)

export const updateClientValidation = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    cpf: vine.string().fixedLength(11).optional(),
    phone: vine.string().mobile().optional(),
    state: vine.string().trim().minLength(2).optional(),
    city: vine.string().trim().minLength(2).optional(),
    neighborhood: vine.string().trim().minLength(2).optional(),
    street: vine.string().trim().minLength(2).optional(),
    streetNumber: vine.string().trim().minLength(1).optional(),
    zipCode: vine.string().trim().minLength(4).optional(),
  })
)
