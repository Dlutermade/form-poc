import { useForm } from '@tanstack/react-form'
import { useRef } from 'react'
import { dynamicFormOpts, dynamicFormSchema } from './schema'

const DynamicForm = () => {
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm({
    ...dynamicFormOpts,
    validators: {
      onChange: dynamicFormSchema,
    },
    onSubmit: async (submitProps) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form Submitted:', submitProps.value)
    },
    onSubmitInvalid() {
      const firstInvalidElements = formRef.current?.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLElement | null

      // check is input or select or textarea
      if (
        firstInvalidElements &&
        (firstInvalidElements.tagName === 'INPUT' ||
          firstInvalidElements.tagName === 'SELECT' ||
          firstInvalidElements.tagName === 'TEXTAREA')
      ) {
        firstInvalidElements.focus()
        return
      }

      // but if not, should window scroll to the element
      if (firstInvalidElements) {
        firstInvalidElements.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    },
  })

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">動態表單</h4>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="mode">
          {(field) => (
            <div className="mb-4">
              <label htmlFor={field.name}>Mode</label>
              <select
                id={field.name}
                className="border border-gray-300 p-2 rounded w-full aria-invalid:border-red-500"
                aria-invalid={!field.state.meta.isValid}
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value as 'once' | 'recurring')
                }
                onBlur={field.handleBlur}
              >
                <option value="once">Once</option>
                <option value="recurring">Recurring</option>
              </select>
              {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors
                    .map((error) => error?.message)
                    .join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.mode}>
          {(mode) => {
            if (mode === 'once') {
              return (
                <form.Field name="datetime">
                  {(field) => (
                    <div className="mb-4">
                      <label htmlFor={field.name}>Datetime</label>
                      <input
                        type="datetime-local"
                        className="border border-gray-300 p-2 rounded w-full aria-invalid:border-red-500"
                        id={field.name}
                        aria-invalid={!field.state.meta.isValid}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-red-500 text-sm mt-1">
                          {field.state.meta.errors
                            .map((error) => error?.message)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              )
            }

            return (
              <div className="mb-4">
                Recurring Mode Selected - Additional Fields Here
                <form.Field name="time">
                  {(field) => (
                    <div className="mb-4">
                      <label htmlFor={field.name}>Time(s)</label>
                      <select
                        id={field.name}
                        multiple
                        className="border border-gray-300 p-2 rounded w-full h-24 aria-invalid:border-red-500"
                        aria-invalid={!field.state.meta.isValid}
                        value={field.state.value}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions,
                          ).map((option) => option.value)
                          field.handleChange(selectedOptions)
                        }}
                        onBlur={field.handleBlur}
                      >
                        {Array.from({ length: 24 }, (_, i) =>
                          i.toString().padStart(2, '0'),
                        ).map((hour) =>
                          ['00', '30'].map((minute) => {
                            const timeValue = `${hour}:${minute}:00`
                            return (
                              <option key={timeValue} value={timeValue}>
                                {timeValue}
                              </option>
                            )
                          }),
                        )}
                      </select>
                      {!field.state.meta.isValid && (
                        <p className="text-red-500 text-sm mt-1">
                          {field.state.meta.errors
                            .map((error) => error?.message)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
                <form.Field name="recurringType">
                  {(field) => (
                    <div className="mb-4">
                      <label htmlFor={field.name}>Recurring Type</label>
                      <select
                        id={field.name}
                        className="border border-gray-300 p-2 rounded w-full aria-invalid:border-red-500"
                        aria-invalid={!field.state.meta.isValid}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value as 'weekly' | 'monthly' | 'yearly',
                          )
                        }
                        onBlur={field.handleBlur}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      {!field.state.meta.isValid && (
                        <p className="text-red-500 text-sm mt-1">
                          {field.state.meta.errors
                            .map((error) => error?.message)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
                <form.Subscribe
                  selector={(state) => state.values.recurringType}
                >
                  {(recurringType) => {
                    if (recurringType === 'weekly') {
                      return (
                        <div className="mt-4">
                          <form.Field name="daysOfWeek">
                            {(field) => (
                              <div className="mb-4">
                                <label htmlFor={field.name}>
                                  Days of Week (0=Sun, 6=Sat)
                                </label>
                                <select
                                  id={field.name}
                                  multiple
                                  className="border border-gray-300 p-2 rounded w-full h-24 aria-invalid:border-red-500"
                                  aria-invalid={!field.state.meta.isValid}
                                  value={field.state.value.map(String)}
                                  onChange={(e) => {
                                    const selectedOptions = Array.from(
                                      e.target.selectedOptions,
                                    ).map((option) => Number(option.value))
                                    field.handleChange(selectedOptions)
                                  }}
                                  onBlur={field.handleBlur}
                                >
                                  <option value="0">Sunday</option>
                                  <option value="1">Monday</option>
                                  <option value="2">Tuesday</option>
                                  <option value="3">Wednesday</option>
                                  <option value="4">Thursday</option>
                                  <option value="5">Friday</option>
                                  <option value="6">Saturday</option>
                                </select>
                                {!field.state.meta.isValid && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {field.state.meta.errors
                                      .map((error) => error?.message)
                                      .join(', ')}
                                  </p>
                                )}
                              </div>
                            )}
                          </form.Field>
                        </div>
                      )
                    }

                    if (recurringType === 'monthly') {
                      return (
                        <form.Field name="daysOfMonth">
                          {(field) => (
                            <div className="mb-4">
                              <label htmlFor={field.name}>
                                Days of Month (1-31)
                              </label>
                              <select
                                id={field.name}
                                multiple
                                className="border border-gray-300 p-2 rounded w-full h-24 aria-invalid:border-red-500"
                                aria-invalid={!field.state.meta.isValid}
                                value={field.state.value.map(String)}
                                onChange={(e) => {
                                  const selectedOptions = Array.from(
                                    e.target.selectedOptions,
                                  ).map((option) => Number(option.value))
                                  field.handleChange(selectedOptions)
                                }}
                                onBlur={field.handleBlur}
                              >
                                {Array.from(
                                  { length: 31 },
                                  (_, i) => i + 1,
                                ).map((day) => (
                                  <option key={day} value={day}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                              {!field.state.meta.isValid && (
                                <p className="text-red-500 text-sm mt-1">
                                  {field.state.meta.errors
                                    .map((error) => error?.message)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>
                      )
                    }

                    return (
                      <div className="mt-4">
                        <form.Field name="yearlyMonths">
                          {(field) => (
                            <div className="mb-4">
                              <label htmlFor={field.name}>
                                Months of Year (1-12)
                              </label>
                              <select
                                id={field.name}
                                multiple
                                className="border border-gray-300 p-2 rounded w-full h-24 aria-invalid:border-red-500"
                                aria-invalid={!field.state.meta.isValid}
                                value={field.state.value.map(String)}
                                onChange={(e) => {
                                  const selectedOptions = Array.from(
                                    e.target.selectedOptions,
                                  ).map((option) => Number(option.value))
                                  field.handleChange(selectedOptions)
                                }}
                                onBlur={field.handleBlur}
                              >
                                {Array.from(
                                  { length: 12 },
                                  (_, i) => i + 1,
                                ).map((month) => (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                ))}
                              </select>
                              {!field.state.meta.isValid && (
                                <p className="text-red-500 text-sm mt-1">
                                  {field.state.meta.errors
                                    .map((error) => error?.message)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="yearlyDays">
                          {(field) => (
                            <div className="mb-4">
                              <label htmlFor={field.name}>
                                Days of Month (1-31)
                              </label>
                              <select
                                id={field.name}
                                multiple
                                className="border border-gray-300 p-2 rounded w-full h-24 aria-invalid:border-red-500"
                                aria-invalid={!field.state.meta.isValid}
                                value={field.state.value.map(String)}
                                onChange={(e) => {
                                  const selectedOptions = Array.from(
                                    e.target.selectedOptions,
                                  ).map((option) => Number(option.value))
                                  field.handleChange(selectedOptions)
                                }}
                                onBlur={field.handleBlur}
                              >
                                {Array.from(
                                  { length: 31 },
                                  (_, i) => i + 1,
                                ).map((day) => (
                                  <option key={day} value={day}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                              {!field.state.meta.isValid && (
                                <p className="text-red-500 text-sm mt-1">
                                  {field.state.meta.errors
                                    .map((error) => error?.message)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>
                      </div>
                    )
                  }}
                </form.Subscribe>
              </div>
            )
          }}
        </form.Subscribe>

        <div className="flex gap-2">
          <button
            type="button"
            className="mt-6 px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700"
            onClick={(e) => {
              e.preventDefault()
              form.reset()
            }}
          >
            Reset
          </button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`mt-6 px-4 py-2 rounded text-white ${
                  canSubmit
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}

export default DynamicForm
