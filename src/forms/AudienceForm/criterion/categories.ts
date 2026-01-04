import {
  joinMemberCriterion,
  orderValueCriterion,
  totalPurchaseCriterion,
  type RegisteredCriterion,
} from './register'

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
// Type-safe Criterion Category Configuration
// ============================================================================

/**
 * Helper to ensure criterions are unique (no duplicates)
 */
function defineCriterions<T extends readonly RegisteredCriterion[]>(
  criterions: T,
): T {
  const types = criterions.map((c) => c.type)
  const uniqueTypes = new Set(types)

  if (types.length !== uniqueTypes.size) {
    const duplicates = types.filter(
      (type, index) => types.indexOf(type) !== index,
    )
    throw new Error(
      `Duplicate criterions detected: ${duplicates.join(', ')}. Each criterion can only appear once in a category.`,
    )
  }

  return criterions
}

/**
 * Category metadata type
 */
export type CriterionCategoryMeta = {
  label: string
  description?: string
  icon?: string
  criterions: readonly RegisteredCriterion[]
}

// ============================================================================
// Category Configuration
// Register criterion instances under their respective categories
// Type-safe: Only accepts registered criterions, prevents duplicates at runtime
// ============================================================================

export const criterionCategoryConfig = {
  [CRITERION_CATEGORY.MEMBERSHIP_BEHAVIOR]: {
    label: '會員行為',
    description: '與會員註冊、加入相關的條件',
    icon: '👥',
    criterions: defineCriterions([joinMemberCriterion]),
  },
  [CRITERION_CATEGORY.PURCHASE_BEHAVIOR]: {
    label: '購買行為',
    description: '與訂單、消費相關的條件',
    icon: '💰',
    criterions: defineCriterions([orderValueCriterion, totalPurchaseCriterion]),
  },
  [CRITERION_CATEGORY.ENGAGEMENT_BEHAVIOR]: {
    label: '互動行為',
    description: '與用戶互動、活躍度相關的條件',
    icon: '📊',
    criterions: defineCriterions([]),
  },
} as const satisfies Record<CRITERION_CATEGORY, CriterionCategoryMeta>
