# Audience Form

## 📋 Overview

Audience Form is a sophisticated audience segmentation system designed for marketing campaigns. It enables users to define complex filtering criteria to precisely target specific audience segments.

## 🎯 Business Purpose

**Use Case**: Marketing campaign audience selection and segmentation

**Example Scenario**:
- Target "New members who joined via LINE in the last 7 days"
- Target "Customers who spent over $1000 in the last 30 days"
- Combine multiple criteria with AND/OR logic for precise audience targeting

## 🏗️ Architecture

### Four-Layer Structure

```
CriterionGroup (AND Logic)
  └── Criterion Group Item (OR Logic)
        └── Criterion
              └── FilterDimension
                    └── FilterMode
```

**Data Structure:**
```typescript
{
  // Outer criterionGroups are combined with AND
  criterionGroups: [
    {
      // Inner criteria within a group are combined with OR
      criteria: [
        {
          type: CRITERION_TYPE.JOIN_MEMBER,
          filterDimensions: [...]
        },
        {
          type: CRITERION_TYPE.ORDER_VALUE,
          filterDimensions: [...]
        }
      ]
    },
    {
      criteria: [
        {
          type: CRITERION_TYPE.TOTAL_PURCHASE,
          filterDimensions: [...]
        }
      ]
    }
  ]
}
```

**Logic:**
- `(Criterion A OR Criterion B) AND (Criterion C) AND (Criterion D OR Criterion E)`

#### 🔵 CriterionGroup Layer
**Definition**: Top-level container that groups criteria with **AND** logic

**Characteristics**:
- Multiple criterion groups are combined with **AND** logic
- Each group contains one or more criteria

#### 🟢 Criterion Group Item Layer  
**Definition**: Container for criteria that are combined with **OR** logic

**Characteristics**:
- Criteria within the same group are combined with **OR** logic
- Allows alternative conditions to be specified

#### 1️⃣ Criterion Layer
**Definition**: High-level business condition categories

**Examples**:
- `JOIN_MEMBER` - Member registration criteria
- `ORDER_VALUE` - Single order value criteria (any single order ≥ amount)
- `TOTAL_PURCHASE` - Total purchase amount criteria (accumulated spending in time period)

**Characteristics**:
- Each criterion contains 1 to many filter dimensions
- Criteria can be grouped with OR logic within a criterion group item

#### 2️⃣ FilterDimension Layer
**Definition**: Specific filtering dimensions within a criterion

**Examples** (for `JOIN_MEMBER` criterion):
- `DATE` FilterDimension - Join date/time filtering
- `TAG` FilterDimension - Join platform filtering (Website, APP, LINE, etc.)

**Examples** (for `MEMBER_GENDER` criterion):
- `TAG` FilterDimension - Gender selection (Male, Female)

**Characteristics**:
- Each filter dimension has a specific type: `DATE`, `NUMBER`, or `TAG`
- Filter dimensions are constrained by their parent criterion type
- Each dimension can have multiple modes for different filtering logic

#### 3️⃣ FilterMode Layer
**Definition**: The specific filtering operation/presentation for a filter dimension

**Examples** (for `DATE` filter dimension):
- `LAST_N_DAYS` - Last N days (e.g., "Last 7 days")
- `NEXT_N` - Next N days/months (e.g., "Next 3 months")
- `CUSTOM_RANGE` - Custom date range (e.g., "2024-01-01 to 2024-12-31")

**Examples** (for `TAG` filter dimension):
- `HAS_ANY` - Contains any of the selected tags
- `HAS_ALL` - Contains all of the selected tags
- `NOT_HAS` - Does not contain the selected tags

**Examples** (for `NUMBER` filter dimension):
- `EQUAL` - Equal to a value
- `GREATER_THAN` - Greater than a value
- `BETWEEN` - Between two values

---

## 🔗 Logic Composition

### AND/OR Logic Structure

**Outer Level (CriterionGroups):** Combined with **AND** logic
**Inner Level (Criteria within a group):** Combined with **OR** logic

**Example:**
```
criterionGroups: [
  Group A → (Criterion 1 OR Criterion 2 OR Criterion 3)
  AND
  Group B → (Criterion 4)
  AND  
  Group C → (Criterion 5 OR Criterion 6)
]

Final Logic: (C1 OR C2 OR C3) AND (C4) AND (C5 OR C6)
```

## 📝 Complete Example

### Use Case: Complex Audience Targeting

**Goal**: Find members who either:
- Joined via LINE in the last 7 days, OR spent over $1000 in a single order
- AND have total purchases over $5000 in the last 30 days

**Configuration**:
```typescript
{
  criterionGroups: [
    {
      // OR group: (Join via LINE recently) OR (High single order value)
      criteria: [
        {
          type: CRITERION_TYPE.JOIN_MEMBER,
          filterDimensions: [
            {
              type: FILTER_DIMENSION_TYPE.TAG,
              mode: TAG_FILTER_MODE.HAS_ANY,
              value: ['LINE']
            },
            {
              type: FILTER_DIMENSION_TYPE.DATE,
              mode: DATE_FILTER_MODE.LAST_N_DAYS,
              value: 7
            }
          ]
        },
        {
          type: CRITERION_TYPE.ORDER_VALUE,
          filterDimensions: [
            {
              type: FILTER_DIMENSION_TYPE.NUMBER,
              mode: NUMBER_FILTER_MODE.GREATER_THAN,
              value: 1000
            }
          ]
        }
      ]
    },
    {
      // AND: High total spending
      criteria: [
        {
          type: CRITERION_TYPE.TOTAL_PURCHASE,
          filterDimensions: [
            {
              type: FILTER_DIMENSION_TYPE.NUMBER,
              mode: NUMBER_FILTER_MODE.GREATER_THAN,
              value: 5000
            },
            {
              type: FILTER_DIMENSION_TYPE.DATE,
              mode: DATE_FILTER_MODE.LAST_N_DAYS,
              value: 30
            }
          ]
        }
      ]
    }
  ]
}
```

**Logic Explanation:**
```
(
  (JOIN_MEMBER via LINE in last 7 days) 
  OR 
  (ORDER_VALUE > $1000)
) 
AND 
(
  TOTAL_PURCHASE > $5000 in last 30 days
)
```

**User Flow**:
1. User enters the audience form (initially empty)
2. Click "Add Criterion" button
3. Modal opens showing criterion types **grouped by category**:
   - 📋 **Membership Behavior**
     - Join Member
   - 💰 **Purchase Behavior**
     - Order Value
     - Total Purchase
4. User selects "Join Member" from "Membership Behavior" category
5. System creates a new criterion group with one criterion of type "Join Member"
6. System injects default filter dimensions for "Join Member":
   - Join Date (DATE) - with default mode
   - Join Source (TAG) - with default options
7. User configures filter dimensions:
   - Set "Join Source" → mode: "Has Any" → value: "LINE"
   - Set "Join Date" → mode: "Last N Days" → value: 7
8. User can now:
   - **Add OR criterion**: Click "Add OR Criterion" within the same group
   - **Add AND criterion group**: Click "Add Criterion Group" to create a new group

## 🛠️ Technical Implementation

### Modular Structure

```
AudienceForm/
├── schema.ts                  # Form validation schema
├── form.ts                    # TanStack Form hooks
├── formContext.ts             # Form context definitions
├── index.tsx                  # Main component
├── criterion/                 # Criterion module
│   ├── index.ts               # Re-exports
│   ├── register.ts            # 📝 Central criterion registration
│   ├── categories.ts          # 📝 UI category organization
│   └── createCriterion/       # Criterion creation utilities
│       ├── types.ts           # Criterion type definitions
│       ├── core.ts            # Core type inference
│       └── index.ts           # Exports
├── filterDimension/           # FilterDimension module
│   ├── index.ts               # Re-exports
│   ├── createFilterDimension/ # FilterDimension creation utilities
│   │   ├── types.ts           # Filter dimension types
│   │   ├── core.ts            # Core type inference
│   │   └── index.ts           # Exports
│   └── impl/                  # 🎨 Form component implementations
│       ├── DateFilterDimension.tsx
│       ├── NumberFilterDimension.tsx
│       └── TagFilterDimension.tsx
└── components/
    └── CriterionSelectionModal/
        ├── index.tsx          # Main modal orchestration
        ├── CategoryNav.tsx    # Left sidebar (auto-imports config)
        └── CriterionList.tsx  # Right scrollable list (auto-imports config)
```

---

## 🎨 Registration System: Two-Step Architecture

### Overview

The criterion system uses a **two-step registration pattern**:
1. **Step 1: Criterion Definition** (`register.ts`) - Define all available criterions with their properties
2. **Step 2: UI Categorization** (`categories.ts`) - Organize criterions into UI categories for the selection modal

This separation ensures:
- ✅ Single source of truth for criterion definitions
- ✅ Compile-time type safety across the entire system
- ✅ Runtime duplicate prevention at both levels
- ✅ Flexible UI organization without affecting data layer

---

### Step 1: Criterion Registration

**File**: `criterion/register.ts`

This is the **central registry** where all criterions are defined with their complete configuration.

```typescript
import { createCriterion } from './createCriterion'
import { FILTER_DIMENSION_TYPE } from '../filterDimension/createFilterDimension/types'

// Define individual criterions
const joinMemberCriterion = createCriterion({
  type: 'JOIN_MEMBER' as const,
  name: 'Join Member',
  meta: {
    description: 'Filter by member registration',
  },
  allowedFilterDimensions: [
    FILTER_DIMENSION_TYPE.DATE,
    FILTER_DIMENSION_TYPE.TAG,
  ] as const,
})

const orderValueCriterion = createCriterion({
  type: 'ORDER_VALUE' as const,
  name: 'Order Value',
  meta: {
    description: 'Filter by single order amount',
  },
  allowedFilterDimensions: [FILTER_DIMENSION_TYPE.NUMBER] as const,
})

// Compile-time duplicate prevention with recursive type checking
type EnsureUniqueTypes<T extends readonly { type: string }[]> = 
  T extends readonly [infer First, ...infer Rest]
    ? First extends { type: infer Type }
      ? Rest extends readonly { type: infer RestType }[]
        ? Type extends RestType
          ? ['Error: Duplicate criterion type detected', Type]
          : readonly [First, ...EnsureUniqueTypes<Rest>]
        : readonly [First]
      : never
    : T

function registerCriteria<T extends readonly { type: string }[]>(
  criteria: EnsureUniqueTypes<T>
): T {
  return criteria as T
}

// Register all criterions (compile-time checked for duplicates)
export const REGISTERED_CRITERIA = registerCriteria([
  joinMemberCriterion,
  orderValueCriterion,
  totalPurchaseCriterion,
] as const)

export type RegisteredCriterion = (typeof REGISTERED_CRITERIA)[number]
```

**Key Features:**
- **Compile-time duplicate check**: `EnsureUniqueTypes<T>` recursively validates no duplicate types
- **Type inference**: `RegisteredCriterion` type automatically derived from the array
- **Single source of truth**: All criterion properties defined in one place

---

### Step 2: UI Categorization

**File**: `criterion/categories.ts`

This file **imports** individual criterion instances and organizes them into UI categories for the modal.

```typescript
import {
  joinMemberCriterion,
  orderValueCriterion,
  totalPurchaseCriterion,
  type RegisteredCriterion,
} from './register'

// UI category enumeration
export enum CRITERION_CATEGORY {
  MEMBERSHIP_BEHAVIOR = 'MEMBERSHIP_BEHAVIOR',
  PURCHASE_BEHAVIOR = 'PURCHASE_BEHAVIOR',
  ENGAGEMENT_BEHAVIOR = 'ENGAGEMENT_BEHAVIOR',
}

// Helper: Runtime duplicate prevention within a category
function defineCriterions<T extends readonly RegisteredCriterion[]>(
  criterions: T
): T {
  const types = criterions.map((c) => c.type)
  const uniqueTypes = new Set(types)

  if (types.length !== uniqueTypes.size) {
    const duplicates = types.filter(
      (type, index) => types.indexOf(type) !== index,
    )
    throw new Error(
      `Duplicate criterions detected: ${duplicates.join(', ')}`
    )
  }

  return criterions
}

// Category metadata with criterion instances
export type CriterionCategoryMeta = {
  label: string
  description?: string
  icon?: string
  criterions: readonly RegisteredCriterion[]
}

// Category configuration (type-safe with satisfies)
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
} as const satisfies Record<CRITERION_CATEGORY, CriterionCategoryMeta>
```

**Key Features:**
- **Direct imports**: Imports criterion instances directly from `register.ts`
- **Runtime duplicate check**: `defineCriterions()` prevents duplicates within each category
- **Type safety**: `satisfies` operator ensures all categories are properly typed
- **Full criterion objects**: Categories contain complete criterion instances, not just type strings

---

### Key Distinction

| Concept                       | Purpose                             | File            | Layer      |
| ----------------------------- | ----------------------------------- | --------------- | ---------- |
| **`REGISTERED_CRITERIA`**     | Central criterion registry          | `register.ts`   | Data Layer |
| **`criterionCategoryConfig`** | UI organization for selection modal | `categories.ts` | UI Layer   |
| **`criterionGroups`**         | Form data structure (AND/OR logic)  | Form state      | Data Layer |

---

## 🔧 Adding New Features

### Adding a New Criterion

**Step 1: Define the Criterion** (`register.ts`)

```typescript
// 1. Create criterion definition
const memberGenderCriterion = createCriterion({
  type: 'MEMBER_GENDER' as const,
  name: 'Member Gender',
  meta: {
    description: 'Filter by member gender',
  },
  allowedFilterDimensions: [FILTER_DIMENSION_TYPE.TAG] as const,
})

// 2. Add to REGISTERED_CRITERIA array
export const REGISTERED_CRITERIA = registerCriteria([
  joinMemberCriterion,
  orderValueCriterion,
  totalPurchaseCriterion,
  memberGenderCriterion,  // ✨ New
] as const)
```

**Step 2: Categorize for UI** (`categories.ts`)

```typescript
import { joinMemberCriterion, memberGenderCriterion } from './register'

export const criterionCategoryConfig = {
  [CRITERION_CATEGORY.MEMBERSHIP_BEHAVIOR]: {
    label: '會員行為',
    icon: '👥',
    criterions: defineCriterions([
      joinMemberCriterion,
      memberGenderCriterion,  // ✨ New
    ]),
  },
  // ...
}
```

**Done!** Type inference and compile-time checks handle everything else.

---

### Adding a New UI Category

**File**: `criterion/categories.ts`

```typescript
// 1. Add to enum
export enum CRITERION_CATEGORY {
  MEMBERSHIP_BEHAVIOR = 'MEMBERSHIP_BEHAVIOR',
  PURCHASE_BEHAVIOR = 'PURCHASE_BEHAVIOR',
  ENGAGEMENT_BEHAVIOR = 'ENGAGEMENT_BEHAVIOR',
  PRODUCT_BEHAVIOR = 'PRODUCT_BEHAVIOR',  // ✨ New
}

// 2. Add configuration
export const criterionCategoryConfig = {
  // ...existing categories
  [CRITERION_CATEGORY.PRODUCT_BEHAVIOR]: {  // ✨ New
    label: 'Product Behavior',
    description: 'Criteria related to product views and interactions',
    icon: '📦',
    criterions: defineCriterions([
      productViewCriterion,  // ✨ Import from register.ts
    ]),
  },
} as const satisfies Record<CRITERION_CATEGORY, CriterionCategoryMeta>
```

**Done!** Modal automatically displays the new category.
---

### Adding a New FilterDimension Type

**File**: `filterDimension/createFilterDimension/types.ts`

```typescript
// 1. Add new filter dimension type enum (if needed)
export enum FILTER_DIMENSION_TYPE {
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  TAG = 'TAG',
  BOOLEAN = 'BOOLEAN',  // ✨ New
}

// 2. Define filter modes for the new type
export enum BOOLEAN_FILTER_MODE {
  IS_TRUE = 'BOOLEAN_IS_TRUE',
  IS_FALSE = 'BOOLEAN_IS_FALSE',
}

// 3. Register in mode mapping
export type FilterDimensionModeMap = {
  [FILTER_DIMENSION_TYPE.DATE]: DATE_FILTER_MODE
  [FILTER_DIMENSION_TYPE.NUMBER]: NUMBER_FILTER_MODE
  [FILTER_DIMENSION_TYPE.TAG]: TAG_FILTER_MODE
  [FILTER_DIMENSION_TYPE.BOOLEAN]: BOOLEAN_FILTER_MODE  // ✨ New
}

// 4. Define value types for each mode
export type FilterModeValuesMap = {
  [BOOLEAN_FILTER_MODE.IS_TRUE]: Record<string, never>   // ✨ No additional values needed
  [BOOLEAN_FILTER_MODE.IS_FALSE]: Record<string, never>  // ✨ No additional values needed
  // ...
}

// 5. Define metadata types
export type FilterDimensionMetaMap = {
  [FILTER_DIMENSION_TYPE.BOOLEAN]: {  // ✨ New
    description?: string
  }
  // ...
}
```

**File**: `filterDimension/impl/BooleanFilterDimension.tsx`

```typescript
// 6. Implement UI component for the new filter dimension
export function BooleanFilterDimension({ ... }) {
  // Component implementation
}
```

---

## 🔑 Key Architectural Principles

### 1. Type Safety
- **Compile-time validation**: Invalid criterion/filter combinations caught before runtime
- **Recursive type checking**: `EnsureUniqueTypes<T>` prevents duplicate registrations
- **Type inference**: `RegisteredCriterion` automatically derived from registration array
- **Discriminated unions**: Precise type narrowing based on criterion/filter selection

### 2. Duplicate Prevention
- **Compile-time**: `EnsureUniqueTypes<T>` recursive type for `REGISTERED_CRITERIA`
- **Runtime (categories)**: `defineCriterions()` validates uniqueness within each category
- **Two-layer validation**: Ensures data integrity at both registration and categorization levels

### 3. Separation of Concerns
- **`register.ts`**: Single source of truth for criterion definitions (Data Layer)
- **`categories.ts`**: UI organization without affecting data structure (UI Layer)
- **`createCriterion/`**: Type inference and factory utilities (Type System)
- **`components/`**: Presentation and user interaction (UI Layer)

### 4. Colocation Pattern
- Components import configuration directly instead of receiving props
- Data preparation happens close to where it's used
- Reduces prop drilling and intermediate state
- Example: `CategoryNav` and `CriterionList` import `criterionCategoryConfig` directly

### 5. Scalability
- Adding criterions: Only modify `register.ts` and `categories.ts`
- Adding categories: Only modify `categories.ts` enum and config
- Adding filter dimensions: Only modify `filterDimension/createFilterDimension/types.ts`
- No changes needed to core logic or type inference system

---

## 🎨 UI Architecture: Criterion Selection Modal

### Component Hierarchy

```
CriterionSelectionModal (index.tsx)
├── State Management
│   └── categoriesIntersectionRate: Partial<Record<CRITERION_CATEGORY, number>>
├── CategoryNav (Left Sidebar)
│   ├── Auto-imports: criterionCategoryConfig
│   ├── Derives: categories array from config
│   └── Calculates: activeCategory from intersection ratios (useMemo)
└── CriterionList (Right Scrollable List)
    ├── Auto-imports: criterionCategoryConfig
    ├── Derives: categoriesWithCriteria from config
    └── CategorySection (per category)
        ├── Intersection Observer per section
        ├── Reports: intersection ratio to parent
        └── Renders: criterion cards with name/description
```

### Scroll Detection: Intersection Observer

**Previous Approach** (Manual scroll calculation):
- ❌ Calculated scroll positions manually
- ❌ Complex viewport/offset calculations
- ❌ Inaccurate category detection (jumping)
- ❌ Performance issues with frequent scroll events

**Current Approach** (Intersection Observer):
- ✅ Native browser API for viewport intersection
- ✅ Precise ratio tracking with threshold array `[0, 0.1, 0.2, ..., 1]`
- ✅ Each `CategorySection` has dedicated observer
- ✅ Reports intersection ratio to parent via callback
- ✅ Parent aggregates ratios and CategoryNav calculates max

```typescript
// CriterionList.tsx - CategorySection component
useEffect(() => {
  const section = sectionRef.current
  if (!section) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      onIntersectionChange(category, entry.intersectionRatio)
    },
    {
      root: scrollAreaViewport,
      threshold: Array.from({ length: 11 }, (_, i) => i * 0.1), // [0, 0.1, 0.2, ..., 1]
    }
  )

  observer.observe(section)
  return () => observer.disconnect()
}, [category, onIntersectionChange])
```

```typescript
// CategoryNav.tsx - Calculate active category
const activeCategory = useMemo(() => {
  let maxCategory: CRITERION_CATEGORY | null = null
  let maxRatio = 0

  Object.entries(categoriesIntersectionRate).forEach(([category, ratio]) => {
    if (ratio && ratio > maxRatio && ratio > 0.1) {
      maxRatio = ratio
      maxCategory = category as CRITERION_CATEGORY
    }
  })

  return maxCategory
}, [categoriesIntersectionRate])
```

### State Management Pattern

**Previous Approach** (Custom Events):
- ❌ `CategorySection` dispatched custom events
- ❌ Hard to trace data flow
- ❌ Difficult to debug

**Current Approach** (Props & Callbacks):
- ✅ Prop-based communication with `Record` type
- ✅ Clear data flow: Child → Parent → Sibling
- ✅ Easy to debug and test
- ✅ Type-safe with `Partial<Record<CRITERION_CATEGORY, number>>`

---

## 🚀 Development Workflow

### Adding a New Criterion (Complete Example)

**Scenario**: Add "Member Age" criterion for age-based filtering

1. **Define in `register.ts`:**
```typescript
const memberAgeCriterion = createCriterion({
  type: 'MEMBER_AGE' as const,
  name: 'Member Age',
  meta: {
    description: 'Filter members by age range',
  },
  allowedFilterDimensions: [FILTER_DIMENSION_TYPE.NUMBER] as const,
})

export const REGISTERED_CRITERIA = registerCriteria([
  // ...existing
  memberAgeCriterion,
] as const)
```

2. **Categorize in `categories.ts`:**
```typescript
import { joinMemberCriterion, memberAgeCriterion } from './register'

export const criterionCategoryConfig = {
  [CRITERION_CATEGORY.MEMBERSHIP_BEHAVIOR]: {
    label: '會員行為',
    icon: '👥',
    criterions: defineCriterions([
      joinMemberCriterion,
      memberAgeCriterion,  // ✨ Add here
    ]),
  },
  // ...
}
```

3. **Done!** The system automatically:
   - ✅ Validates uniqueness at compile-time
   - ✅ Infers `RegisteredCriterion` type
   - ✅ Shows in modal under "Membership Behavior"
   - ✅ Allows `NUMBER` filter dimension (as specified)

---

## 📊 Data Flow Summary

```
User Interaction
    ↓
[Modal Opens] → CategoryNav & CriterionList auto-import criterionCategoryConfig
    ↓
[User Scrolls] → CategorySection Intersection Observers detect visibility
    ↓
[Ratio Reports] → onIntersectionChange callback → Parent aggregates
    ↓
[Active Calculation] → CategoryNav useMemo finds max ratio → Highlights category
    ↓
[User Selects] → Criterion selection → Form state update
    ↓
[Validation] → Valibot schema validates structure
    ↓
[Submit] → { criterionGroups: [...] } → Backend API
```

---

## 🎨 Form Integration

### TanStack Form Features

Uses **TanStack Form** for robust state management:
- ✅ **Type-safe form state**: Full TypeScript inference throughout form
- ✅ **Field-level validation**: Individual field validators with Valibot
- ✅ **Context-based composition**: Form context accessible across components
- ✅ **Custom hooks**: Reusable form logic and field access
- ✅ **Performance**: Optimized re-renders with granular subscriptions

### Validation with Valibot

- Schema-based validation for `criterionGroups` structure
- Type-safe with discriminated unions for different criterion types
- Mode-specific validators for filter dimension values
- Custom error messages for better UX

---

## 📚 Design Patterns Used

### 1. Factory Pattern
- `createCriterion()` - Creates criterion instances with type inference
- `createFilterDimension()` - Creates filter dimension instances

### 2. Registry Pattern  
- `REGISTERED_CRITERIA` - Central registry for all criterions
- `criterionCategoryConfig` - UI category registry

### 3. Strategy Pattern
- Different filter modes (e.g., `LAST_N_DAYS`, `CUSTOM_RANGE`) as strategies
- Swappable validation and rendering logic per mode

### 4. Observer Pattern
- Intersection Observer for scroll detection
- Callback-based communication between components

### 5. Colocation Pattern
- Components import configuration directly
- Data preparation near usage reduces coupling

---

## 🔄 Future Enhancement Ideas

Potential areas for expansion:

### New Criterion Types
- **Behavioral Tracking**: Page views, button clicks, time on site
- **Product Interactions**: Wishlist additions, cart abandonment, product reviews
- **Communication**: Email opens, SMS responses, notification engagement

### New Filter Dimensions
- **Segment Dimension**: Reference pre-defined audience segments
- **Custom Field Dimension**: Support for user-defined custom fields
- **Geolocation Dimension**: Country, city, radius-based filtering

### Advanced Features
- **Nested Groups**: Support for complex nested AND/OR logic
- **Criterion Templates**: Save and reuse common criterion configurations
- **Preview Mode**: Real-time audience count estimation
- **Export/Import**: Share criterion configurations across campaigns

### UI Improvements
- **Drag & Drop**: Reorder criterion groups visually
- **Bulk Actions**: Apply operations to multiple criterions at once
- **Search & Filter**: Quick search within criterion selection modal
- **History**: Undo/redo for criterion changes

---

## ✅ Best Practices

### When Adding New Criterions

1. ✅ **Define in `register.ts` first** - Single source of truth
2. ✅ **Use `registerCriteria()` wrapper** - Compile-time duplicate check
3. ✅ **Add to appropriate category** - Better UX in selection modal
4. ✅ **Use `defineCriterions()` in categories** - Runtime validation
5. ✅ **Provide descriptive metadata** - Helps users understand purpose

### When Modifying Components

1. ✅ **Prefer direct imports over props** - Colocation reduces complexity
2. ✅ **Use `useMemo` for derived state** - Optimize performance
3. ✅ **Leverage Intersection Observer** - Better scroll detection than manual calc
4. ✅ **Use callbacks for upward communication** - Clear data flow
5. ✅ **Type all props explicitly** - Catch errors at compile-time

### Code Organization

1. ✅ **Keep registration separate from UI** - `register.ts` vs `categories.ts`
2. ✅ **One criterion per constant** - Easier to reference and maintain
3. ✅ **Use `as const` assertions** - Better type inference
4. ✅ **Use `satisfies` for configs** - Ensure type safety without widening
5. ✅ **Document with comments** - Explain business logic and constraints

---

## 🐛 Common Pitfalls to Avoid

### ❌ Don't modify `REGISTERED_CRITERIA` array directly
```typescript
// ❌ Wrong
REGISTERED_CRITERIA.push(newCriterion)

// ✅ Correct
export const REGISTERED_CRITERIA = registerCriteria([
  ...existing,
  newCriterion,
] as const)
```

### ❌ Don't use criterion types without registering
```typescript
// ❌ Wrong - type exists but not registered
const unregisteredCriterion = createCriterion({
  type: 'UNREGISTERED_TYPE' as const,
  // ...
})

// ✅ Correct - add to REGISTERED_CRITERIA
export const REGISTERED_CRITERIA = registerCriteria([
  unregisteredCriterion,
  // ...
] as const)
```

### ❌ Don't duplicate criterions across categories without checking
```typescript
// ❌ Wrong - will throw runtime error
criterions: [
  joinMemberCriterion,
  joinMemberCriterion,  // Duplicate!
]

// ✅ Correct - defineCriterions() will catch this
criterions: defineCriterions([
  joinMemberCriterion,
])
```

### ❌ Don't pass prepared data as props if it can be derived
```typescript
// ❌ Wrong - unnecessary prop drilling
<CategoryNav categories={preparedCategories} />

// ✅ Correct - import and derive internally
// Inside CategoryNav:
import { criterionCategoryConfig } from '../../criterion/categories'
const categories = Object.entries(criterionCategoryConfig).map(...)
```

---

## 📖 Quick Reference

### File Responsibilities

| File                                             | Purpose                          | When to Modify                    |
| ------------------------------------------------ | -------------------------------- | --------------------------------- |
| `criterion/register.ts`                          | Central criterion registry       | Adding/removing criterions        |
| `criterion/categories.ts`                        | UI category organization         | Adding categories or reorganizing |
| `criterion/createCriterion/types.ts`             | Type definitions for criterions  | Rarely (low-level type changes)   |
| `filterDimension/createFilterDimension/types.ts` | Filter dimension types and modes | Adding new filter types/modes     |
| `filterDimension/impl/*.tsx`                     | Filter dimension UI components   | Changing filter UI/behavior       |
| `components/CriterionSelectionModal/*.tsx`       | Modal UI components              | Improving modal UX                |

### Key Type Exports

```typescript
// From register.ts
import { REGISTERED_CRITERIA, type RegisteredCriterion } from './criterion/register'

// From categories.ts  
import { 
  criterionCategoryConfig,
  CRITERION_CATEGORY,
  type CriterionCategoryMeta 
} from './criterion/categories'

// From createCriterion
import type { Criterion } from './criterion/createCriterion/types'

// From createFilterDimension
import { 
  FILTER_DIMENSION_TYPE,
  DATE_FILTER_MODE,
  NUMBER_FILTER_MODE,
  TAG_FILTER_MODE
} from './filterDimension/createFilterDimension/types'
```

---

## 🎓 Learning Path

For new developers joining the project:

1. **Understand the 4-layer architecture** - Read "Architecture" section
2. **Explore existing criterions** - Check `register.ts` examples
3. **Try adding a simple criterion** - Follow "Adding a New Criterion" guide
4. **Understand UI categories** - Read "Registration System" section
5. **Study type inference** - Examine `createCriterion/core.ts`
6. **Explore filter dimensions** - Check `filterDimension/impl/` components
7. **Review modal components** - Understand Intersection Observer pattern

---

**Last Updated**: 2026-01-04
