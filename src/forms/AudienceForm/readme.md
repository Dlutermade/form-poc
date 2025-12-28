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
├── schema.ts           # Form validation schema
├── form.ts            # TanStack Form hooks
├── formContext.ts     # Form context definitions
├── index.tsx          # Main component
└── utils/
    ├── createCriterion/           # Criterion utilities
    │   ├── types.ts               # 📝 Register criterion types
    │   ├── categories.ts          # 📝 Register UI categories
    │   ├── core.ts                # Core type inference
    │   ├── examples.ts            # Usage examples
    │   └── index.ts               # Exports
    └── createFilterDimension/     # FilterDimension utilities
        ├── types.ts               # 📝 Register filter types
        ├── core.ts                # Core type inference
        ├── examples.ts            # Usage examples
        └── index.ts               # Exports
```

---

## 🎨 UI Layer: Criterion Categories

### Purpose
`CriterionCategory` is a **UI-only configuration** that groups criterion types for better user experience. It has no impact on the data structure or business logic.

### Structure

**File**: `utils/createCriterion/categories.ts`

```typescript
export enum CRITERION_CATEGORY {
  MEMBERSHIP_BEHAVIOR = 'MEMBERSHIP_BEHAVIOR',
  PURCHASE_BEHAVIOR = 'PURCHASE_BEHAVIOR',
  ENGAGEMENT_BEHAVIOR = 'ENGAGEMENT_BEHAVIOR',
}

export type CriterionCategoryMeta = {
  label: string
  description?: string
  icon?: string
  criterionTypes: CRITERION_TYPE[]
}

export const criterionCategoryConfig: Record<CRITERION_CATEGORY, CriterionCategoryMeta> = {
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
    criterionTypes: [
      CRITERION_TYPE.ORDER_VALUE,
      CRITERION_TYPE.TOTAL_PURCHASE,
    ],
  },
}
```

### Key Distinction

| Concept                 | Purpose                         | Layer          | Example                      |
| ----------------------- | ------------------------------- | -------------- | ---------------------------- |
| **`criterionGroups`**   | Form data structure (AND logic) | Data Layer     | `{ criterionGroups: [...] }` |
| **`CriterionCategory`** | UI grouping for selection modal | UI Layer       | Categories in modal          |
| **`CRITERION_TYPE`**    | Business condition type         | Business Layer | `JOIN_MEMBER`, `ORDER_VALUE` |

### Usage in Components

```typescript
import { criterionCategoryConfig } from './utils/createCriterion/categories'

// In criterion selection modal
const CriterionSelectionModal = () => {
  return (
    <div>
      {Object.entries(criterionCategoryConfig).map(([key, config]) => (
        <CategorySection key={key}>
          <CategoryHeader>
            {config.icon} {config.label}
          </CategoryHeader>
          <CategoryDescription>{config.description}</CategoryDescription>
          <CriterionList>
            {config.criterionTypes.map(type => (
              <CriterionOption value={type} />
            ))}
          </CriterionList>
        </CategorySection>
      ))}
    </div>
  )
}
```

---

## 🔧 Type Registration System

### Adding a New Criterion Type

**File**: `utils/createCriterion/types.ts`

```typescript
// 1. Add new criterion type
export enum CRITERION_TYPE {
  JOIN_MEMBER = 'JOIN_MEMBER',
  ORDER_VALUE = 'ORDER_VALUE',
  TOTAL_PURCHASE = 'TOTAL_PURCHASE',
  MEMBER_GENDER = 'MEMBER_GENDER',  // ✨ New
}

// 2. Register allowed filter dimensions for this criterion
export type CriterionAllowedFilterDimensionsMap = {
  [CRITERION_TYPE.JOIN_MEMBER]: FILTER_DIMENSION_TYPE.DATE | FILTER_DIMENSION_TYPE.TAG
  [CRITERION_TYPE.ORDER_VALUE]: FILTER_DIMENSION_TYPE.NUMBER | FILTER_DIMENSION_TYPE.DATE
  [CRITERION_TYPE.TOTAL_PURCHASE]: FILTER_DIMENSION_TYPE.NUMBER | FILTER_DIMENSION_TYPE.DATE
  [CRITERION_TYPE.MEMBER_GENDER]: FILTER_DIMENSION_TYPE.TAG  // ✨ New
}

// 3. Define metadata for this criterion
export type CriterionMetaMap = {
  [CRITERION_TYPE.MEMBER_GENDER]: {  // ✨ New
    description?: string
  }
}
```

**File**: `utils/createCriterion/categories.ts`

```typescript
// 4. Add to UI category (optional but recommended)
export const criterionCategoryConfig: Record<CRITERION_CATEGORY, CriterionCategoryMeta> = {
  [CRITERION_CATEGORY.MEMBERSHIP_BEHAVIOR]: {
    label: '會員行為',
    criterionTypes: [
      CRITERION_TYPE.JOIN_MEMBER,
      CRITERION_TYPE.MEMBER_GENDER,  // ✨ New
    ],
  },
  // ...
}
```

#### Adding a New FilterDimension Type

**File**: `utils/createFilterDimension/types.ts`

```typescript
// 1. Add new filter dimension type (if needed)
export enum FILTER_DIMENSION_TYPE {
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  TAG = 'TAG',
  // BOOLEAN = 'BOOLEAN',  // ✨ Example new type
}

// 2. Add new filter modes (if adding new dimension type)
export enum BOOLEAN_FILTER_MODE {
  TRUE = 'BOOLEAN_TRUE',
  FALSE = 'BOOLEAN_FALSE',
}

// 3. Register mode to dimension mapping
export type FilterDimensionModeMap = {
  [FILTER_DIMENSION_TYPE.DATE]: DATE_FILTER_MODE
  [FILTER_DIMENSION_TYPE.NUMBER]: NUMBER_FILTER_MODE
  [FILTER_DIMENSION_TYPE.TAG]: TAG_FILTER_MODE
  // [FILTER_DIMENSION_TYPE.BOOLEAN]: BOOLEAN_FILTER_MODE  // ✨ New
}

// 4. Register value types for each mode
export type FilterModeValuesMap = {
  // [BOOLEAN_FILTER_MODE.TRUE]: Record<string, never>  // ✨ New
  // [BOOLEAN_FILTER_MODE.FALSE]: Record<string, never>
}

// 5. Register metadata types
export type FilterDimensionMetaMap = {
  // [FILTER_DIMENSION_TYPE.BOOLEAN]: {  // ✨ New
  //   description?: string
  // }
}
```

## 🔑 Key Features

### Type Safety
- Full TypeScript type inference
- Compile-time validation of criterion and filter dimension compatibility
- Automatic type narrowing based on selections

### Scalability
- Easy to add new criterion types (just modify `types.ts`)
- Easy to add new filter dimensions and modes
- No need to modify core logic when extending

### Separation of Concerns
- **types.ts**: Registration layer (modify when adding new types)
- **core.ts**: Type inference layer (no modification needed)
- **examples.ts**: Usage examples and documentation

### Type Constraints
- Each criterion type can only use specific filter dimension types
- Invalid combinations are caught at compile time
- Example: `MEMBER_GENDER` criterion cannot use `NUMBER` filter dimension

## 🚀 Development Workflow

### Adding a New Criterion

1. Open `utils/createCriterion/types.ts`
2. Add to `CRITERION_TYPE` enum
3. Register in `CriterionAllowedFilterDimensionsMap`
4. Define metadata in `CriterionMetaMap`
5. **(Optional but recommended)** Add to `criterionCategoryConfig` in `categories.ts` for UI grouping
6. Done! Type inference handles the rest

### Adding a New UI Category

1. Open `utils/createCriterion/categories.ts`
2. Add to `CRITERION_CATEGORY` enum
3. Add configuration in `criterionCategoryConfig`
4. Done! Modal will automatically show the new category

### Adding a New FilterDimension

1. Open `utils/createFilterDimension/types.ts`
2. Add to `FILTER_DIMENSION_TYPE` enum (if new type)
3. Add mode enum for the new dimension
4. Register in `FilterDimensionModeMap`
5. Define value types in `FilterModeValuesMap`
6. Define metadata in `FilterDimensionMetaMap`
7. Done! Type inference handles the rest

## 📊 Data Flow

```
User Interaction (UI Layer)
    ↓
Open Modal → Select Category (CriterionCategory)
    ↓
Select Criterion Type (e.g., JOIN_MEMBER)
    ↓
System injects default FilterDimensions
    ↓
User configures FilterMode and values
    ↓
Validation (Valibot schema)
    ↓
Form State (TanStack Form)
    ↓
Data Structure: { criterionGroups: [...] }
    ↓
Submit → Backend API
```

## 🎨 Form Integration

Uses **TanStack Form** for:
- Type-safe form state management
- Field-level validation
- Context-based form composition
- Custom form hooks

## 📚 Related Concepts

- **Group Logic**: Outer layer that combines multiple criteria with AND/OR operators
- **Validation**: Each filter mode can have custom Valibot validators
- **Default Values**: Each filter mode defines its default values
- **Mode Switching**: Optional reset of values when mode changes (configurable per filter dimension)

## 🔄 Future Enhancements

Potential areas for expansion:
- Add `BEHAVIORAL` criterion types (page views, clicks, etc.)
- Add `SEGMENT` filter dimensions (pre-defined audience segments)
- Add `CUSTOM_FIELD` filter dimensions (user-defined fields)
- Support nested criterion groups for complex logic
