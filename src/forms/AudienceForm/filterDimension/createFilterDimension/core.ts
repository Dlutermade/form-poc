import type { StandardSchemaV1 } from '@tanstack/react-form'
import type {
  FILTER_DIMENSION_TYPE,
  FilterDimensionModeMap,
  FilterModeValuesMap,
  FilterDimensionMetaMap,
} from './types'

// ============================================================================
// Core Types - Type inference system for createFilterDimension
// ============================================================================

export type ModeConfig<M extends keyof FilterModeValuesMap> = {
  name: M
  defaultValues: FilterModeValuesMap[M]
  validator?: StandardSchemaV1<FilterModeValuesMap[M], unknown>
}

export type ModeSetting<T extends FILTER_DIMENSION_TYPE> = {
  [K in FilterDimensionModeMap[T] & keyof FilterModeValuesMap]: ModeConfig<K>
}[FilterDimensionModeMap[T] & keyof FilterModeValuesMap]

export type CreateFilterDimensionConfig<
  N extends string,
  T extends FILTER_DIMENSION_TYPE,
  DM extends FilterDimensionModeMap[T] & keyof FilterModeValuesMap,
> = {
  name: N
  type: T
  meta: FilterDimensionMetaMap[T]
  modeSettings: ModeSetting<T>[]
  defaultMode: DM
}

export type FilterDimensionConfig<
  N extends string,
  T extends FILTER_DIMENSION_TYPE,
  DM extends FilterDimensionModeMap[T] & keyof FilterModeValuesMap,
> = CreateFilterDimensionConfig<N, T, DM>

// ============================================================================
// Main API - createFilterDimension function
// ============================================================================

export function createFilterDimension<
  N extends string,
  T extends FILTER_DIMENSION_TYPE,
  DM extends FilterDimensionModeMap[T] & keyof FilterModeValuesMap,
>(
  config: CreateFilterDimensionConfig<N, T, DM>,
): FilterDimensionConfig<N, T, DM> {
  return config
}
