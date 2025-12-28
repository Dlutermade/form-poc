import { object, number, enum_ } from 'valibot'
import {
  createFilterDimension,
  DATE_FILTER_MODE,
  DATE_UNIT,
  FILTER_DIMENSION_TYPE,
} from '../createFilterDimension'
import { createCriterion } from './core'
import { CRITERION_TYPE } from './types'

// ============================================================================
// Usage Examples
// ============================================================================

export const joinMemberCriterionExample = createCriterion({
  name: 'Join Member Criterion',
  type: CRITERION_TYPE.JOIN_MEMBER,
  meta: {
    description: 'Filter members by join date',
  },
  filterDimensions: [
    createFilterDimension({
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
      ],
      defaultMode: DATE_FILTER_MODE.LAST_N_DAYS,
    }),
  ],
})
