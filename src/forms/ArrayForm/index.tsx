import { useForm } from '@tanstack/react-form'
import { arrayFormOpts, arrayFormSchema } from './schema'
import { useRef } from 'react'

const ArrayForm = () => {
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm({
    ...arrayFormOpts,
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
    validators: {
      onChange: arrayFormSchema,
    },
  })

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">陣列表單</h4>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="name">
          {(field) => (
            <div className="mb-4">
              <label htmlFor={field.name}>Name</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full aria-invalid:border-red-500"
                id={field.name}
                aria-invalid={!field.state.meta.isValid}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Name"
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

        <form.Field name="items" mode="array">
          {(field) => (
            <div
              aria-label="Items List"
              aria-invalid={!field.state.meta.isValid}
              className="mb-4 aria-invalid:border-red-500 border border-gray-300 p-4 rounded mx-4"
            >
              <label className="font-semibold">Items</label>
              {field.state.value.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-gray-300 p-4 rounded mb-4"
                >
                  <form.Field name={`${field.name}[${index}]`}>
                    {(itemField) => (
                      <div className="space-y-2">
                        <form.Field name={`${itemField.name}.itemName`}>
                          {(itemNameField) => (
                            <div>
                              <label htmlFor={itemNameField.name}>
                                Item Name
                              </label>
                              <input
                                type="text"
                                className="border border-gray-300 p-2 rounded w-full aria-invalid:border-red-500"
                                id={itemNameField.name}
                                aria-invalid={!itemNameField.state.meta.isValid}
                                value={itemNameField.state.value}
                                onChange={(e) =>
                                  itemNameField.handleChange(e.target.value)
                                }
                                onBlur={itemNameField.handleBlur}
                                placeholder="Item Name"
                              />
                              {!itemNameField.state.meta.isValid && (
                                <p className="text-red-500 text-sm mt-1">
                                  {itemNameField.state.meta.errors
                                    .map((error) => error?.message)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>

                        <form.Field name={`${itemField.name}.quantity`}>
                          {(quantityField) => (
                            <div>
                              <label htmlFor={quantityField.name}>
                                Quantity
                              </label>
                              <input
                                type="number"
                                className="border border-gray-300 p-2 rounded w-full aria-invalid:border-red-500"
                                id={quantityField.name}
                                aria-invalid={!quantityField.state.meta.isValid}
                                value={quantityField.state.value}
                                onChange={(e) =>
                                  quantityField.handleChange(
                                    Number(e.target.value),
                                  )
                                }
                                onBlur={quantityField.handleBlur}
                                placeholder="Quantity"
                              />
                              {!quantityField.state.meta.isValid && (
                                <p className="text-red-500 text-sm mt-1">
                                  {quantityField.state.meta.errors
                                    .map((error) => error?.message)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>

                        <form.Field name={`${itemField.name}.action`}>
                          {(actionField) => (
                            <div>
                              <label htmlFor={actionField.name}>Action</label>
                              <select
                                className="border border-gray-300 p-2 rounded w-full aria-invalid:border-red-500"
                                id={actionField.name}
                                aria-invalid={!actionField.state.meta.isValid}
                                value={actionField.state.value}
                                onChange={(e) =>
                                  actionField.handleChange(
                                    e.target.value as 'buy' | 'sell',
                                  )
                                }
                                onBlur={actionField.handleBlur}
                              >
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                              </select>
                              {!actionField.state.meta.isValid && (
                                <p className="text-red-500 text-sm mt-1">
                                  {actionField.state.meta.errors
                                    .map((error) => error?.message)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>

                        {/* Additional fields for quantity and action can be added here */}
                        <button
                          type="button"
                          className="mt-2 px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                          onClick={() => field.removeValue(index)}
                        >
                          Remove Item
                        </button>
                      </div>
                    )}
                  </form.Field>
                </div>
              ))}
              <button
                type="button"
                className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                onClick={() =>
                  field.pushValue({
                    id: Date.now(),
                    itemName: '',
                    quantity: 1,
                    action: 'buy' as const,
                  })
                }
              >
                Add Item
              </button>
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
            selector={(form) => [form.canSubmit, form.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                className={`mt-6 px-4 py-2 rounded text-white ${
                  canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
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

export default ArrayForm
