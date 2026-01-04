// ============================================================================
// FilterDimension Types Registration
// This is the main file to modify when adding new filter dimension types
// ============================================================================

// Define all filter dimension types
export enum FILTER_DIMENSION_TYPE {
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  TAG = 'TAG',
}

// ============================================================================
// Date FilterDimension
// ============================================================================

export enum DATE_FILTER_MODE {
  NONE = 'DATE_NONE',
  LAST_N_DAYS = 'DATE_LAST_N_DAYS',
  NEXT_N = 'DATE_NEXT_N',
  CUSTOM_RANGE = 'DATE_CUSTOM_RANGE',
}

export enum DATE_UNIT {
  DAYS = 'days',
  MONTHS = 'months',
}

// ============================================================================
// Number FilterDimension
// ============================================================================

export enum NUMBER_FILTER_MODE {
  NONE = 'NUMBER_NONE',
  EQUAL = 'NUMBER_EQUAL',
  GREATER_THAN = 'NUMBER_GREATER_THAN',
  LESS_THAN = 'NUMBER_LESS_THAN',
  BETWEEN = 'NUMBER_BETWEEN',
}

// ============================================================================
// Tag FilterDimension
// ============================================================================

export enum TAG_FILTER_MODE {
  NONE = 'TAG_NONE',
  TAG_HAS_ANY = 'TAG_HAS_ANY',
  TAG_HAS_ALL = 'TAG_HAS_ALL',
  TAG_NOT_HAS = 'TAG_NOT_HAS',
}

// ============================================================================
// Type Mappings - Register filter dimension type to mode associations
// ============================================================================

export type FilterDimensionModeMap = {
  [FILTER_DIMENSION_TYPE.DATE]: DATE_FILTER_MODE
  [FILTER_DIMENSION_TYPE.NUMBER]: NUMBER_FILTER_MODE
  [FILTER_DIMENSION_TYPE.TAG]: TAG_FILTER_MODE
}

// ============================================================================
// Mode Values - Register value types for each mode
// ============================================================================

export type FilterModeValuesMap = {
  // Date modes
  [DATE_FILTER_MODE.NONE]: Record<string, never>
  [DATE_FILTER_MODE.LAST_N_DAYS]: { value: number | undefined }
  [DATE_FILTER_MODE.NEXT_N]: { value: number | undefined; unit: DATE_UNIT }
  [DATE_FILTER_MODE.CUSTOM_RANGE]: {
    value: [string | undefined, string | undefined]
  }

  // Number modes
  [NUMBER_FILTER_MODE.NONE]: Record<string, never>
  [NUMBER_FILTER_MODE.EQUAL]: { value: number | undefined }
  [NUMBER_FILTER_MODE.GREATER_THAN]: { value: number | undefined }
  [NUMBER_FILTER_MODE.LESS_THAN]: { value: number | undefined }
  [NUMBER_FILTER_MODE.BETWEEN]: {
    value: [number | undefined, number | undefined]
  }

  // Tag modes
  [TAG_FILTER_MODE.NONE]: Record<string, never>
  [TAG_FILTER_MODE.TAG_HAS_ANY]: { value: string[] }
  [TAG_FILTER_MODE.TAG_HAS_ALL]: { value: string[] }
  [TAG_FILTER_MODE.TAG_NOT_HAS]: { value: string[] }
}

// ============================================================================
// Meta Configuration - Register metadata types for each filter dimension type
// ============================================================================

export type FilterDimensionMetaMap = {
  [FILTER_DIMENSION_TYPE.DATE]: {
    isModeChangedShouldResetValues?: boolean
  }
  [FILTER_DIMENSION_TYPE.NUMBER]: {
    isModeChangedShouldResetValues?: boolean
  }
  [FILTER_DIMENSION_TYPE.TAG]: {
    isModeChangedShouldResetValues?: boolean
    options: Array<{ label: string; value: string }>
  }
}
