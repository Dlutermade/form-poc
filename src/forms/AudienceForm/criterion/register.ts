import { array, enum_, number, object, string } from 'valibot'
import {
  createFilterDimension,
  DATE_FILTER_MODE,
  DATE_UNIT,
  FILTER_DIMENSION_TYPE,
  NUMBER_FILTER_MODE,
  TAG_FILTER_MODE,
} from '../filterDimension'
import { createCriterion } from './createCriterion/core'
import { CRITERION_TYPE } from './createCriterion/types'
import type { CriterionConfig } from './createCriterion/core'

// ============================================================================
// Criterion Registry
// Array-based registration of all available criteria
// ============================================================================

export const joinMemberCriterion = createCriterion({
  name: 'Join Member',
  type: CRITERION_TYPE.JOIN_MEMBER,
  meta: {
    description: 'Filter members by join date and source',
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
    createFilterDimension({
      name: 'Join Source',
      type: FILTER_DIMENSION_TYPE.TAG,
      meta: {
        isModeChangedShouldResetValues: false,
        options: [
          { label: 'Website', value: 'website' },
          { label: 'APP', value: 'app' },
          { label: 'LINE', value: 'line' },
          { label: 'Social Media', value: 'social_media' },
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
      ],
      defaultMode: TAG_FILTER_MODE.TAG_HAS_ANY,
    }),
  ],
})

export const orderValueCriterion = createCriterion({
  name: 'Order Value',
  type: CRITERION_TYPE.ORDER_VALUE,
  meta: {
    description: 'Filter by single order value',
  },
  filterDimensions: [
    createFilterDimension({
      name: 'Order Amount',
      type: FILTER_DIMENSION_TYPE.NUMBER,
      meta: {
        isModeChangedShouldResetValues: true,
      },
      modeSettings: [
        {
          name: NUMBER_FILTER_MODE.NONE,
          defaultValues: {},
        },
        {
          name: NUMBER_FILTER_MODE.GREATER_THAN,
          defaultValues: { value: undefined },
          validator: object({
            value: number(),
          }),
        },
      ],
      defaultMode: NUMBER_FILTER_MODE.GREATER_THAN,
    }),
  ],
})
export const totalPurchaseCriterion = createCriterion({
  name: 'Total Purchase',
  type: CRITERION_TYPE.TOTAL_PURCHASE,
  meta: {
    description: 'Filter by total purchase amount',
  },
  filterDimensions: [
    createFilterDimension({
      name: 'Total Amount',
      type: FILTER_DIMENSION_TYPE.NUMBER,
      meta: {
        isModeChangedShouldResetValues: true,
      },
      modeSettings: [
        {
          name: NUMBER_FILTER_MODE.NONE,
          defaultValues: {},
        },
        {
          name: NUMBER_FILTER_MODE.GREATER_THAN,
          defaultValues: { value: undefined },
          validator: object({
            value: number(),
          }),
        },
      ],
      defaultMode: NUMBER_FILTER_MODE.GREATER_THAN,
    }),
    createFilterDimension({
      name: 'Time Period',
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
      ],
      defaultMode: DATE_FILTER_MODE.LAST_N_DAYS,
    }),
  ],
})

// ============================================================================
// Criterion Registry with Type-level Duplicate Prevention
// ============================================================================

/**
 * Type-level check for unique criterion types
 * This ensures no duplicate types at compile time
 */
type EnsureUniqueTypes<T extends readonly CriterionConfig<CRITERION_TYPE>[]> =
  T extends readonly [infer First, ...infer Rest]
    ? First extends CriterionConfig<infer FirstType>
      ? Rest extends readonly CriterionConfig<CRITERION_TYPE>[]
        ? FirstType extends Rest[number]['type']
          ? ['Error: Duplicate criterion type detected', FirstType]
          : readonly [First, ...EnsureUniqueTypes<Rest>]
        : T
      : T
    : T

/**
 * Helper function to register criteria with type-level duplicate check
 */
function registerCriteria<T extends readonly CriterionConfig<CRITERION_TYPE>[]>(
  criteria: EnsureUniqueTypes<T> & T,
): T {
  return criteria
}

export const REGISTERED_CRITERIA = registerCriteria([
  joinMemberCriterion,
  orderValueCriterion,
  totalPurchaseCriterion,
] as const)

export type RegisteredCriterion = (typeof REGISTERED_CRITERIA)[number]
