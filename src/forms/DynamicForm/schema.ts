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

// ============================================================================
// Valibot Version
// ============================================================================

import {
  array,
  check,
  custom,
  isoDateTime,
  isoTimeSecond,
  literal,
  minLength,
  number,
  object,
  optional,
  picklist,
  pipe,
  rawCheck,
  string,
  variant,
} from 'valibot'
import type { InferOutput } from 'valibot'

// Zod schema matching the valibot structure
export const dynamicFormZodSchema = z
  .object({
    mode: z.enum(['once', 'recurring']),
    datetime: z
      .string()
      .min(1, 'Datetime is required')
      .datetime({ message: 'Invalid datetime format' })
      .optional(),
    recurringType: z.enum(['weekly', 'monthly', 'yearly']),
    daysOfWeek: z.array(
      z
        .number()
        .min(0, 'Please select at least one day of week')
        .max(6, 'Please select at least one day of week'),
    ),
    daysOfMonth: z.array(
      z
        .number()
        .min(1, 'Please select at least one day of month')
        .max(31, 'Please select at least one day of month'),
    ),
    yearlyMonths: z.array(
      z
        .number()
        .min(1, 'Please select at least one month')
        .max(12, 'Please select at least one month'),
    ),
    yearlyDays: z.array(
      z
        .number()
        .min(1, 'Please select at least one day')
        .max(31, 'Please select at least one day'),
    ),
    time: z.array(z.string().time({ message: 'Invalid time format' })),
  })
  .superRefine((data, ctx) => {
    // In once mode, datetime must be provided
    if (data.mode === 'once' && !data.datetime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Datetime is required in once mode',
        path: ['datetime'],
      })
    }

    // In once mode, datetime must be after current time
    if (data.mode === 'once' && data.datetime) {
      const currentDate = new Date()
      const selectedDateTime = new Date(data.datetime)
      if (selectedDateTime <= currentDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Datetime must be after current time',
          path: ['datetime'],
        })
      }
    }

    // In recurring mode, time must be provided
    if (data.mode === 'recurring' && data.time.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one time',
        path: ['time'],
      })
    }

    // In recurring weekly mode, daysOfWeek must be provided
    if (
      data.mode === 'recurring' &&
      data.recurringType === 'weekly' &&
      data.daysOfWeek.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one day of week',
        path: ['daysOfWeek'],
      })
    }

    // In recurring monthly mode, daysOfMonth must be provided
    if (
      data.mode === 'recurring' &&
      data.recurringType === 'monthly' &&
      data.daysOfMonth.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one day of month',
        path: ['daysOfMonth'],
      })
    }

    // In recurring yearly mode, yearlyMonths and yearlyDays must be provided
    if (
      data.mode === 'recurring' &&
      data.recurringType === 'yearly' &&
      data.yearlyMonths.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one month and one day',
        path: ['yearlyMonths'],
      })
    }

    if (
      data.mode === 'recurring' &&
      data.recurringType === 'yearly' &&
      data.yearlyDays.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one month and one day',
        path: ['yearlyDays'],
      })
    }
  })

type DynamicZodFormType = z.infer<typeof dynamicFormZodSchema>

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
  daysOfWeek: pipe(
    array(pipe(number())),
    check(
      (days) => days.every((day) => day >= 0 && day <= 6),
      'Days of week must be between 0 (Sunday) and 6 (Saturday)',
    ),
    minLength(1, 'Please select at least one day of week'),
  ),
})

const recurringMonthlyFormSchema = object({
  ...recurringBaseFields,
  recurringType: literal('monthly'),
  daysOfMonth: pipe(
    array(pipe(number())),
    check(
      (days) => days.every((day) => day >= 1 && day <= 31),
      'Days of month must be between 1 and 31',
    ),
    minLength(1, 'Please select at least one day of month'),
  ),
})

const recurringYearlyFormSchema = object({
  ...recurringBaseFields,
  recurringType: literal('yearly'),
  yearlyMonths: pipe(
    array(pipe(number())),
    check(
      (months) => months.every((month) => month >= 1 && month <= 12),
      'Months must be between 1 and 12',
    ),
    minLength(1, 'Please select at least one month'),
  ),
  yearlyDays: pipe(
    array(pipe(number())),
    check(
      (days) => days.every((day) => day >= 1 && day <= 31),
      'Days must be between 1 and 31',
    ),
    minLength(1, 'Please select at least one day'),
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

const dynamicFormSchema2 = pipe(
  object({
    mode: picklist(['once', 'recurring']),
    datetime: optional(
      pipe(
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
    ),
    recurringType: picklist(['weekly', 'monthly', 'yearly']),
    daysOfWeek: pipe(array(pipe(number()))),
    daysOfMonth: pipe(array(pipe(number()))),
    yearlyMonths: pipe(array(pipe(number()))),
    yearlyDays: pipe(array(pipe(number()))),
    time: pipe(array(pipe(string(), isoTimeSecond('Invalid time format')))),
  }),
  rawCheck(({ dataset, addIssue }) => {
    if (!dataset.typed) {
      return
    }
    // In once mode, datetime must be provided
    if (dataset.value.mode === 'once' && !dataset.value.datetime) {
      addIssue({
        message: 'Datetime is required in once mode',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'datetime',
            value: dataset.value.datetime,
          },
        ],
      })
    }

    if (dataset.value.mode === 'recurring' && dataset.value.time.length === 0) {
      addIssue({
        message: 'Please select at least one time',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'time',
            value: dataset.value.time,
          },
        ],
      })
    }

    if (
      dataset.value.mode === 'recurring' &&
      dataset.value.recurringType === 'weekly' &&
      dataset.value.daysOfWeek.length === 0
    ) {
      addIssue({
        message: 'Please select at least one day of week',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'daysOfWeek',
            value: dataset.value.daysOfWeek,
          },
        ],
      })
    }

    if (
      dataset.value.mode === 'recurring' &&
      dataset.value.recurringType === 'weekly' &&
      dataset.value.daysOfMonth.every((day) => day < 0 || day > 6)
    ) {
      addIssue({
        message: 'Days of week must be between 0 (Sunday) and 6 (Saturday)',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'daysOfWeek',
            value: dataset.value.daysOfWeek,
          },
        ],
      })
    }

    if (
      dataset.value.mode === 'recurring' &&
      dataset.value.recurringType === 'monthly' &&
      dataset.value.daysOfMonth.length === 0
    ) {
      addIssue({
        message: 'Please select at least one day of month',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'daysOfMonth',
            value: dataset.value.daysOfMonth,
          },
        ],
      })
    }

    if (
      dataset.value.mode === 'recurring' &&
      dataset.value.recurringType === 'monthly' &&
      dataset.value.daysOfMonth.every((day) => day < 1 || day > 31)
    ) {
      addIssue({
        message: 'Days of month must be between 1 and 31',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'daysOfMonth',
            value: dataset.value.daysOfMonth,
          },
        ],
      })
    }

    if (
      dataset.value.mode === 'recurring' &&
      dataset.value.recurringType === 'yearly' &&
      dataset.value.yearlyMonths.length === 0
    ) {
      addIssue({
        message: 'Please select at least one month and one day',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'yearlyMonths',
            value: dataset.value.yearlyMonths,
          },
        ],
      })
    }

    if (
      dataset.value.mode === 'recurring' &&
      dataset.value.recurringType === 'yearly' &&
      dataset.value.yearlyMonths.every((month) => month < 1 || month > 12)
    ) {
      addIssue({
        message: 'Months must be between 1 and 12',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'yearlyMonths',
            value: dataset.value.yearlyMonths,
          },
        ],
      })
    }

    if (
      dataset.value.mode === 'recurring' &&
      dataset.value.recurringType === 'yearly' &&
      dataset.value.yearlyDays.length === 0
    ) {
      addIssue({
        message: 'Please select at least one month and one day',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'yearlyDays',
            value: dataset.value.yearlyDays,
          },
        ],
      })
    }

    if (
      dataset.value.mode === 'recurring' &&
      dataset.value.recurringType === 'yearly' &&
      dataset.value.yearlyDays.every((day) => day < 1 || day > 31)
    ) {
      addIssue({
        message: 'Days must be between 1 and 31',
        path: [
          {
            type: 'object',
            origin: 'key',
            input: dataset.value,
            key: 'yearlyDays',
            value: dataset.value.yearlyDays,
          },
        ],
      })
    }
  }),
)
