import z from "zod"

export const AddressId = z.uuidv4().brand("AddressId")

export const Address = z.object({
  id: AddressId,
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
})