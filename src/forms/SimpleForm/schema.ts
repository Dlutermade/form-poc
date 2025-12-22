import { formOptions } from '@tanstack/react-form'
import z from 'zod'

const simpleFormSchema = z.object({
  userName: z.string().min(1, 'User Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

type SimpleFormType = z.infer<typeof simpleFormSchema>

const defaultValues: SimpleFormType = {
  userName: '',
  password: '',
}

const simpleFormOpts = formOptions({
  defaultValues,
})

export type { SimpleFormType }
export { simpleFormSchema, simpleFormOpts }
