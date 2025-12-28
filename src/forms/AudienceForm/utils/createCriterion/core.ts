import type {
  CRITERION_TYPE,
  CriterionAllowedFilterDimensionsMap,
  CriterionMetaMap,
} from './types'
import type { FilterDimensionConfig } from '../createFilterDimension'

// ============================================================================
// Core Types - Type inference system for createCriterion
// ============================================================================

export type CriterionFilterDimensionsMap = {
  [K in CRITERION_TYPE]: Array<
    FilterDimensionConfig<string, CriterionAllowedFilterDimensionsMap[K], any>
  >
}

export type CreateCriterionConfig<T extends CRITERION_TYPE> = {
  name: string
  type: T
  filterDimensions: CriterionFilterDimensionsMap[T]
  meta?: CriterionMetaMap[T]
}

export type CriterionConfig<T extends CRITERION_TYPE> = CreateCriterionConfig<T>

// ============================================================================
// Main API - createCriterion function
// ============================================================================

export function createCriterion<T extends CRITERION_TYPE>(
  config: CreateCriterionConfig<T>,
): CriterionConfig<T> {
  return config
}
