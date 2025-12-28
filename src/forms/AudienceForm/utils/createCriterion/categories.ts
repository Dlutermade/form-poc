import { CRITERION_TYPE } from './types'

// ============================================================================
// UI Layer: Criterion Categories
// This file defines how criterion types are grouped in the UI selection modal
// ============================================================================

export enum CRITERION_CATEGORY {
  MEMBERSHIP_BEHAVIOR = 'MEMBERSHIP_BEHAVIOR',
  PURCHASE_BEHAVIOR = 'PURCHASE_BEHAVIOR',
  ENGAGEMENT_BEHAVIOR = 'ENGAGEMENT_BEHAVIOR',
}

// ============================================================================
// Category Metadata Type
// ============================================================================

export type CriterionCategoryMeta = {
  label: string
  description?: string
  icon?: string
  criterionTypes: CRITERION_TYPE[]
}

// ============================================================================
// Category Configuration
// Register criterion types under their respective categories
// ============================================================================

export const criterionCategoryConfig: Record<
  CRITERION_CATEGORY,
  CriterionCategoryMeta
> = {
  [CRITERION_CATEGORY.MEMBERSHIP_BEHAVIOR]: {
    label: '會員行為',
    description: '與會員註冊、加入相關的條件',
    icon: '👥',
    criterionTypes: [CRITERION_TYPE.JOIN_MEMBER],
  },
  [CRITERION_CATEGORY.PURCHASE_BEHAVIOR]: {
    label: '購買行為',
    description: '與訂單、消費相關的條件',
    icon: '💰',
    criterionTypes: [CRITERION_TYPE.ORDER_VALUE, CRITERION_TYPE.TOTAL_PURCHASE],
  },
  [CRITERION_CATEGORY.ENGAGEMENT_BEHAVIOR]: {
    label: '互動行為',
    description: '與用戶互動、活躍度相關的條件',
    icon: '📊',
    criterionTypes: [],
  },
}
