import { object, array, string, number, enum_, tuple } from 'valibot'
import { createFilterDimension } from './core'
import {
  FILTER_DIMENSION_TYPE,
  DATE_FILTER_MODE,
  TAG_FILTER_MODE,
  DATE_UNIT,
} from './types'

// ============================================================================
// Usage Examples
// ============================================================================

// Tag FilterDimension Example
export const tagFilterDimensionExample = createFilterDimension({
  name: 'Join From',
  type: FILTER_DIMENSION_TYPE.TAG,
  meta: {
    isModeChangedShouldResetValues: false,
    options: [
      { label: 'Newsletter', value: 'newsletter' },
      { label: 'Social Media', value: 'social_media' },
      { label: 'Referral', value: 'referral' },
    ],
  },
  modeSettings: [
    {
      name: TAG_FILTER_MODE.NONE,
      defaultValues: {},
    },
    {
      name: TAG_FILTER_MODE.TAG_HAS_ANY,
      defaultValues: { value: [] },
      validator: object({
        value: array(string()),
      }),
    },
    {
      name: TAG_FILTER_MODE.TAG_HAS_ALL,
      defaultValues: { value: [] },
      validator: object({
        value: array(string()),
      }),
    },
    {
      name: TAG_FILTER_MODE.TAG_NOT_HAS,
      defaultValues: { value: [] },
      validator: object({
        value: array(string()),
      }),
    },
  ],
  defaultMode: TAG_FILTER_MODE.TAG_HAS_ANY,
})

// Date FilterDimension Example
export const dateFilterDimensionExample = createFilterDimension({
  name: 'Join Date',
  type: FILTER_DIMENSION_TYPE.DATE,
  meta: {
    isModeChangedShouldResetValues: true,
  },
  modeSettings: [
    {
      name: DATE_FILTER_MODE.NONE,
      defaultValues: {},
    },
    {
      name: DATE_FILTER_MODE.LAST_N_DAYS,
      defaultValues: { value: undefined },
      validator: object({
        value: number(),
      }),
    },
    {
      name: DATE_FILTER_MODE.NEXT_N,
      defaultValues: { value: undefined, unit: DATE_UNIT.DAYS },
      validator: object({
        value: number(),
        unit: enum_(DATE_UNIT),
      }),
    },
    {
      name: DATE_FILTER_MODE.CUSTOM_RANGE,
      defaultValues: { value: [undefined, undefined] },
      validator: object({
        value: tuple([string(), string()]),
      }),
    },
  ],
  defaultMode: DATE_FILTER_MODE.NONE,
})
