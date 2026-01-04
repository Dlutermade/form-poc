import { useState, useCallback, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { type CRITERION_CATEGORY } from '../../criterion/categories'
import type { CRITERION_TYPE } from '../../criterion/createCriterion/types'
import { CategoryNav } from './CategoryNav'
import { CriterionList } from './CriterionList'

export type CriterionSelectionModalProps = {
  /**
   * Called when user selects a criterion
   * @param criterionType - The selected criterion type
   */
  onSelect: (criterionType: CRITERION_TYPE) => void
  /**
   * Current criterion type (for edit mode)
   * If provided, modal will scroll to this criterion on open
   */
  currentCriterionType?: CRITERION_TYPE
} & (
  | {
      /**
       * Controlled mode: externally managed open state
       */
      open: boolean
      onOpenChange: (open: boolean) => void
      trigger?: never
    }
  | {
      /**
       * Uncontrolled mode: trigger button manages its own state
       */
      trigger: ReactNode
      open?: never
      onOpenChange?: never
    }
)

export function CriterionSelectionModal(props: CriterionSelectionModalProps) {
  const { onSelect, currentCriterionType } = props

  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)

  // Determine which mode we're in and get the appropriate values
  const isControlled = 'open' in props
  const open = isControlled ? props.open : internalOpen
  const onOpenChange = isControlled ? props.onOpenChange : setInternalOpen

  const [categoriesIntersectionRate, setCategoriesIntersectionRate] = useState<
    Partial<Record<CRITERION_CATEGORY, number>>
  >({})

  // Category navigation click - scroll to section
  const onCategoryClick = useCallback((category: CRITERION_CATEGORY) => {
    const sectionElement = document.querySelector(
      `[data-category="${category}"]`,
    )
    sectionElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Update intersection rate from CriterionList
  const onIntersectionChange = useCallback(
    (category: CRITERION_CATEGORY, ratio: number) => {
      setCategoriesIntersectionRate((prev) => ({
        ...prev,
        [category]: ratio,
      }))
    },
    [],
  )

  // Criterion selection
  const onCriterionSelect = useCallback(
    (criterionType: CRITERION_TYPE) => {
      onSelect(criterionType)
      onOpenChange!(false)
    },
    [onSelect, onOpenChange],
  )

  const dialogContent = (
    <DialogContent className="max-w-4xl max-h-[80vh] p-0 min-w-[60vw]">
      <DialogHeader className="px-6 pt-6">
        <DialogTitle>
          {currentCriterionType ? '編輯條件' : '選擇條件類型'}
        </DialogTitle>
        <DialogDescription>
          {currentCriterionType
            ? '選擇要切換的條件類型,或點選相同類型以編輯設定'
            : '選擇一個條件類型以建立新的篩選條件'}
        </DialogDescription>
      </DialogHeader>

      <div className="flex h-[calc(80vh-8rem)]">
        {/* Left Sidebar - Fixed Navigation */}
        <div className="w-48 shrink-0 border-r">
          <CategoryNav
            categoriesIntersectionRate={categoriesIntersectionRate}
            onCategoryClick={onCategoryClick}
          />
        </div>

        {/* Right Content - Scrollable List */}
        <CriterionList
          selectedCriterion={currentCriterionType}
          onCriterionSelect={onCriterionSelect}
          onIntersectionChange={onIntersectionChange}
          className="flex-1"
        />
      </div>
    </DialogContent>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isControlled && props.trigger && (
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      )}
      {dialogContent}
    </Dialog>
  )
}
