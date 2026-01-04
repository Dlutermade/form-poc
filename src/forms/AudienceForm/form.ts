import { createFormHook } from '@tanstack/react-form'
import { audienceFieldContext, audienceFormContext } from './formContext'

export const {
  useAppForm: useAudienceForm,
  withFieldGroup: withAudienceFieldGroup,
  withForm: withAudienceForm,
} = createFormHook({
  formContext: audienceFormContext,
  fieldContext: audienceFieldContext,
  formComponents: {},
  fieldComponents: {},
})
