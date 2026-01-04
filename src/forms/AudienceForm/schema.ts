import {
  array,
  literal,
  maxLength,
  minLength,
  object,
  picklist,
  pipe,
  unknown,
  variant,
} from 'valibot'
import type { InferOutput } from 'valibot'
import { CRITERION_TYPE } from './criterion'
import {
  DATE_FILTER_MODE,
  FILTER_DIMENSION_TYPE,
  NUMBER_FILTER_MODE,
  TAG_FILTER_MODE,
} from './filterDimension'

// ============================================================================
// FilterDimension Schemas
// ============================================================================

/**
 * Date FilterDimension Schema
 * Validates structure for DATE type filter dimensions
 * Actual value validation is handled by createFilterDimension validators
 */
const dateFilterDimensionSchema = object({
  type: literal(FILTER_DIMENSION_TYPE.DATE),
  mode: picklist([
    DATE_FILTER_MODE.NONE,
    DATE_FILTER_MODE.LAST_N_DAYS,
    DATE_FILTER_MODE.NEXT_N,
    DATE_FILTER_MODE.CUSTOM_RANGE,
  ]),
  value: unknown(), // Validated by createFilterDimension
})

/**
 * Number FilterDimension Schema
 * Validates structure for NUMBER type filter dimensions
 */
const numberFilterDimensionSchema = object({
  type: literal(FILTER_DIMENSION_TYPE.NUMBER),
  mode: picklist([
    NUMBER_FILTER_MODE.NONE,
    NUMBER_FILTER_MODE.EQUAL,
    NUMBER_FILTER_MODE.GREATER_THAN,
    NUMBER_FILTER_MODE.LESS_THAN,
    NUMBER_FILTER_MODE.BETWEEN,
  ]),
  value: unknown(), // Validated by createFilterDimension
})

/**
 * Tag FilterDimension Schema
 * Validates structure for TAG type filter dimensions
 */
const tagFilterDimensionSchema = object({
  type: literal(FILTER_DIMENSION_TYPE.TAG),
  mode: picklist([
    TAG_FILTER_MODE.NONE,
    TAG_FILTER_MODE.TAG_HAS_ANY,
    TAG_FILTER_MODE.TAG_HAS_ALL,
    TAG_FILTER_MODE.TAG_NOT_HAS,
  ]),
  value: unknown(), // Validated by createFilterDimension
})

/**
 * FilterDimension Schema (Discriminated Union)
 * Uses variant to ensure type and mode compatibility
 */
const filterDimensionSchema = variant('type', [
  dateFilterDimensionSchema,
  numberFilterDimensionSchema,
  tagFilterDimensionSchema,
])

// ============================================================================
// Criterion Schema
// ============================================================================

/**
 * Criterion Schema
 * Validates criterion structure
 * Type/FilterDimension compatibility is ensured by createCriterion type system
 */
const criterionSchema = object({
  type: picklist([
    CRITERION_TYPE.JOIN_MEMBER,
    CRITERION_TYPE.ORDER_VALUE,
    CRITERION_TYPE.TOTAL_PURCHASE,
  ]),
  filterDimensions: pipe(
    array(filterDimensionSchema),
    minLength(1, 'At least one filter dimension is required'),
  ),
})

// ============================================================================
// CriterionGroup Schema
// ============================================================================

/**
 * CriterionGroup Schema
 * Represents a group of criteria combined with OR logic
 */
const criterionGroupSchema = object({
  criteria: pipe(
    array(criterionSchema),
    minLength(1, 'At least one criterion is required per group'),
  ),
})

// ============================================================================
// Audience Form Schema
// ============================================================================

/**
 * Main Audience Form Schema
 * Top-level schema with criterionGroups combined with AND logic
 * - Minimum: 1 criterion group
 * - Maximum: 10 criterion groups
 */
export const audienceFormSchema = object({
  criterionGroups: pipe(
    array(criterionGroupSchema),
    minLength(1, 'At least one criterion group is required'),
    maxLength(10, 'Maximum 10 criterion groups allowed'),
  ),
})

// ============================================================================
// TypeScript Types
// ============================================================================

/**
 * Inferred TypeScript type for the entire audience form
 * Use this type for form state, props, and API payloads
 */
export type AudienceFormSchema = InferOutput<typeof audienceFormSchema>

/**
 * Individual type exports for convenience
 */
export type FilterDimensionSchema = InferOutput<typeof filterDimensionSchema>
export type CriterionSchema = InferOutput<typeof criterionSchema>
export type CriterionGroupSchema = InferOutput<typeof criterionGroupSchema>
