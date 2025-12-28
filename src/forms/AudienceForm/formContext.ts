import { createFormHookContexts } from '@tanstack/react-form'

export const {
  fieldContext: audienceFieldContext,
  formContext: audienceFormContext,
  useFormContext: useAudienceFormContext,
  useFieldContext: useAudienceFieldContext,
} = createFormHookContexts()
