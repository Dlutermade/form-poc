/**
 * Specifies the schema for the dynamic form.
 *
 * this is a scheduler form schema
 *
 * you can select once mode or recurring mode
 * if once mode you need to provide a datetime (year, month, day, hour, minute) and it must be after current time
 *
 * if recurring mode you can choose:
 *
 * - Weekly: select which days of week (e.g., every Monday and Wednesday) and time
 * - Monthly: select which days of month (e.g., every 1st and 15th) and time
 * - Yearly: select which months and days (e.g., every January 1st and December 25th) and time
 */

import { formOptions } from '@tanstack/react-form'
import z from 'zod'

// Once mode schema: just need a datetime
const onceFormZodSchema = z.object({
  mode: z.literal('once'),
  datetime: z
    .string()
    .datetime({ message: 'Invalid datetime format' })
    .refine(
      (value) => new Date(value) > new Date(),
      'Datetime must be after current time',
    ),
})

// Recurring mode schema: need recurring type, time, and corresponding date fields
const recurringBaseZodFields = {
  mode: z.literal('recurring'),
  time: z.array(z.string().time()).min(1, 'At least one time is required'),
}

const recurringWeeklyFormZodSchema = z.object({
  ...recurringBaseZodFields,
  recurringType: z.literal('weekly'),
  daysOfWeek: z.array(z.number().min(0).max(6)).min(1),
})
const recurringMonthlyFormZodSchema = z.object({
  ...recurringBaseZodFields,
  recurringType: z.literal('monthly'),
  daysOfMonth: z.array(z.number().min(1).max(31)).min(1),
})
const recurringYearlyFormZodSchema = z.object({
  ...recurringBaseZodFields,
  recurringType: z.literal('yearly'),
  yearlyMonths: z.array(z.number().min(1).max(12)).min(1),
  yearlyDays: z.array(z.number().min(1).max(31)).min(1),
})
// Discriminated union based on mode
const recurringFormZodSchema = z.discriminatedUnion('recurringType', [
  recurringWeeklyFormZodSchema,
  recurringMonthlyFormZodSchema,
  recurringYearlyFormZodSchema,
])
export const dynamicFormZodSchema = z.discriminatedUnion('mode', [
  onceFormZodSchema,
  recurringFormZodSchema,
])

type DynamicZodFormType = z.infer<typeof dynamicFormZodSchema>

// ============================================================================
// Valibot Version
// ============================================================================

import {
  pipe,
  minValue,
  maxValue,
  object,
  literal,
  number,
  string,
  minLength,
  isoDateTime,
  custom,
  type InferOutput,
  variant,
  array,
  isoTimeSecond,
  optional,
  picklist,
} from 'valibot'

// Once mode schema: just need a datetime
const onceFormSchema = pipe(
  object({
    mode: literal('once'),
    // recurringType: literal(''),
    datetime: pipe(
      string(),
      minLength(1, 'Datetime is required'),
      isoDateTime('Invalid datetime format'),
      custom<string>((value) => {
        const currentDate = new Date()
        const selectedDateTime = new Date(value as string)
        if (selectedDateTime <= currentDate) {
          return false
        }
        return true
      }, 'Datetime must be after current time'),
    ),
  }),
)

// Recurring mode schema: need recurring type, time, and corresponding date fields
const recurringBaseFields = {
  mode: literal('recurring'),
  time: pipe(
    array(pipe(string(), isoTimeSecond('Invalid time format'))),
    minLength(1, 'At least one time is required'),
  ),
}
const recurringWeeklyFormSchema = object({
  ...recurringBaseFields,
  recurringType: literal('weekly'),
  daysOfWeek: optional(
    pipe(
      array(
        pipe(
          number(),
          minValue(0, 'Please select at least one day of week'),
          maxValue(6, 'Please select at least one day of week'),
        ),
      ),
      minLength(1, 'Please select at least one day of week'),
    ),
  ),
})

const recurringMonthlyFormSchema = object({
  ...recurringBaseFields,
  recurringType: literal('monthly'),
  daysOfMonth: optional(
    pipe(
      array(
        pipe(
          number(),
          minValue(1, 'Please select at least one day of month'),
          maxValue(31, 'Please select at least one day of month'),
        ),
      ),
      minLength(1, 'Please select at least one day of month'),
    ),
  ),
})

const recurringYearlyFormSchema = object({
  ...recurringBaseFields,
  recurringType: literal('yearly'),
  yearlyMonths: optional(
    pipe(
      array(
        pipe(
          number(),
          minValue(1, 'Please select at least one month'),
          maxValue(12, 'Please select at least one month'),
        ),
      ),
      minLength(1, 'Please select at least one month'),
    ),
  ),
  yearlyDays: optional(
    pipe(
      array(
        pipe(
          number(),
          minValue(1, 'Please select at least one day'),
          maxValue(31, 'Please select at least one day'),
        ),
      ),
      minLength(1, 'Please select at least one day'),
    ),
  ),
})

const recurringFormSchema = variant('recurringType', [
  recurringWeeklyFormSchema,
  recurringMonthlyFormSchema,
  recurringYearlyFormSchema,
])

// Discriminated union based on mode
const dynamicFormSchema = variant('mode', [onceFormSchema, recurringFormSchema])

type DynamicFormType = InferOutput<typeof dynamicFormSchema>

const defaultValues: DynamicFormType = {
  mode: 'once',
  datetime: new Date(
    new Date().getTime() -
      new Date().getTimezoneOffset() * 60 * 1000 +
      30 * 60 * 1000,
  )
    .toISOString()
    .slice(0, 16),
}

const dynamicFormOpts = formOptions({
  defaultValues: defaultValues as DynamicFormType,
})

export type { DynamicFormType }
export { dynamicFormSchema, dynamicFormOpts }
