import { FILTER_DIMENSION_TYPE } from '../createFilterDimension'

// ============================================================================
// Criterion Types Registration
// This is the main file to modify when adding new criterion types
// ============================================================================

// Define all criterion types
export enum CRITERION_TYPE {
  JOIN_MEMBER = 'JOIN_MEMBER',
  ORDER_AMOUNT = 'ORDER_AMOUNT',
}

// ============================================================================
// Allowed FilterDimension Types - Register which filter dimension types each criterion can use
// ============================================================================

export type CriterionAllowedFilterDimensionsMap = {
  [CRITERION_TYPE.JOIN_MEMBER]:
    | FILTER_DIMENSION_TYPE.DATE
    | FILTER_DIMENSION_TYPE.TAG
  [CRITERION_TYPE.ORDER_AMOUNT]:
    | FILTER_DIMENSION_TYPE.NUMBER
    | FILTER_DIMENSION_TYPE.DATE
}

// ============================================================================
// Meta Configuration - Register metadata types for each criterion type
// ============================================================================

export type CriterionMetaMap = {
  [CRITERION_TYPE.JOIN_MEMBER]: {
    description?: string
  }
  [CRITERION_TYPE.ORDER_AMOUNT]: {
    description?: string
  }
}
