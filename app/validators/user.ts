import vine from '@vinejs/vine'

export const storeUserValidation = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
)
