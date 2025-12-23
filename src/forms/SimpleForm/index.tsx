import { useForm } from '@tanstack/react-form'
import { simpleFormOpts, simpleFormSchema } from './schema'
import type z from 'zod'

const SimpleForm = () => {
  const form = useForm({
    ...simpleFormOpts,
    onSubmit: async (submitProps) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (submitProps.value.userName === 'gg') {
        submitProps.formApi.setErrorMap({
          onSubmit: {
            fields: {
              userName: [
                {
                  message: 'This user name is Disallowed.',
                },
                {
                  message: 'Please choose another one.',
                },
              ] as Array<z.ZodError>,
            },
          },
        })

        return
      }

      console.log('Form Submitted:', submitProps.value)
    },
    validators: {
      onChange: simpleFormSchema,
    },
  })

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">簡易表單</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="userName">
          {(field) => (
            <div>
              <label htmlFor={field.name}>User Name</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
                id={field.name}
                aria-invalid={!field.state.meta.isValid}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="User Name"
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

        <form.Field name="password">
          {(field) => (
            <div className="mt-4">
              <label htmlFor={field.name}>Password</label>
              <input
                type="password"
                className="border border-gray-300 p-2 rounded w-full"
                id={field.name}
                aria-invalid={!field.state.meta.isValid}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Password"
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

export default SimpleForm
