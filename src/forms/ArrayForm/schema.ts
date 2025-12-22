import { formOptions } from '@tanstack/react-form'
import z from 'zod'

const arrayFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  items: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()], 'ID must be a string or number'),
        itemName: z.string().min(1, 'Item Name is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        action: z.enum(
          ['buy', 'sell'],
          "Action must be either 'buy' or 'sell'",
        ),
      }),
    )
    .min(1, 'At least one item is required')
    .refine(
      (items) => {
        const itemNames = items.map((item) => item.itemName)
        const uniqueItemNames = new Set(itemNames)
        return uniqueItemNames.size === itemNames.length
      },
      {
        message: 'Item Names must be unique',
      },
    ),
})

type ArrayFormType = z.infer<typeof arrayFormSchema>

const defaultValues: ArrayFormType = {
  name: '',
  items: [
    {
      id: 1,
      itemName: 'USDT',
      quantity: 1,
      action: 'buy',
    },
  ],
}

const arrayFormOpts = formOptions({
  defaultValues,
})

export type { ArrayFormType }
export { arrayFormSchema, arrayFormOpts }
