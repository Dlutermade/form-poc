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

### Three-Layer Structure

```
Criterion (Condition)
  └── FilterDimension (Filter) 
        └── FilterMode (Mode)
```

#### 1️⃣ Criterion Layer
**Definition**: High-level business condition categories

**Examples**:
- `JOIN_MEMBER` - Member registration criteria
- `ORDER` - Order-related criteria
- `MEMBER_GENDER` - Member gender criteria

**Characteristics**:
- Each criterion contains 1 to many filter dimensions
- Multiple criteria can be combined with AND/OR logic (determined by outer group)

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

## 📝 Complete Example

### Use Case: Target New LINE Members

**Goal**: Find members who joined via LINE in the last 7 days

**Configuration**:
```typescript
{
  criterion: {
    type: CRITERION_TYPE.JOIN_MEMBER,
    filters: [
      {
        dimension: FILTER_DIMENSION_TYPE.TAG,
        mode: TAG_FILTER_MODE.HAS_ANY,
        value: ['LINE']
      },
      {
        dimension: FILTER_DIMENSION_TYPE.DATE,
        mode: DATE_FILTER_MODE.LAST_N_DAYS,
        value: 7
      }
    ]
  }
}
```

**User Flow**:
1. Select criterion: "Join Member"
2. Add filter dimension: "Join Platform" (TAG)
   - Select mode: "Has Any"
   - Select value: "LINE"
3. Add filter dimension: "Join Date" (DATE)
   - Select mode: "Last N Days"
   - Input value: 7

## 🛠️ Technical Implementation

### Modular Structure

```
AudienceForm/
├── schema.ts           # Form validation schema
├── form.ts            # TanStack Form hooks
├── formContext.ts     # Form context definitions
├── index.tsx          # Main component
└── utils/
    ├── createCriterion/      # Criterion (Condition) utilities
    │   ├── types.ts          # 📝 Register new criterion types here
    │   ├── core.ts           # Core type inference system
    │   ├── examples.ts       # Usage examples
    │   └── index.ts          # Exports
    └── createFilterDimension/ # FilterDimension (Filter) utilities
        ├── types.ts          # 📝 Register new filter types here
        ├── core.ts           # Core type inference system
        ├── examples.ts       # Usage examples
        └── index.ts          # Exports
```

### Type Registration System

#### Adding a New Criterion Type

**File**: `utils/createCriterion/types.ts`

```typescript
// 1. Add new criterion type
export enum CRITERION_TYPE {
  JOIN_MEMBER = 'JOIN_MEMBER',
  ORDER = 'ORDER',
  MEMBER_GENDER = 'MEMBER_GENDER',  // ✨ New
}

// 2. Register allowed filter dimensions for this criterion
export type CriterionAllowedFilterDimensionsMap = {
  [CRITERION_TYPE.JOIN_MEMBER]: FILTER_DIMENSION_TYPE.DATE | FILTER_DIMENSION_TYPE.TAG
  [CRITERION_TYPE.ORDER]: FILTER_DIMENSION_TYPE.NUMBER | FILTER_DIMENSION_TYPE.DATE
  [CRITERION_TYPE.MEMBER_GENDER]: FILTER_DIMENSION_TYPE.TAG  // ✨ New
}

// 3. Define metadata for this criterion
export type CriterionMetaMap = {
  [CRITERION_TYPE.MEMBER_GENDER]: {  // ✨ New
    description?: string
  }
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
5. Done! Type inference handles the rest

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
User Interaction
    ↓
Select Criterion Type (e.g., JOIN_MEMBER)
    ↓
Add FilterDimension (e.g., DATE)
    ↓
Select FilterMode (e.g., LAST_N_DAYS)
    ↓
Input Value (e.g., 7)
    ↓
Validation (Valibot schema)
    ↓
Form State (TanStack Form)
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
