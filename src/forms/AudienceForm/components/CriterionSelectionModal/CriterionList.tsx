import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  criterionCategoryConfig,
  type CRITERION_CATEGORY,
  type CriterionCategoryMeta,
} from '../../criterion/categories'
import type { CRITERION_TYPE } from '../../criterion/createCriterion/types'
import type { RegisteredCriterion } from '../../criterion/register'

export type CriterionListProps = {
  selectedCriterion?: CRITERION_TYPE
  onCriterionSelect: (criterionType: CRITERION_TYPE) => void
  onIntersectionChange: (category: CRITERION_CATEGORY, ratio: number) => void
  className?: string
}

type CategorySectionProps = {
  category: CRITERION_CATEGORY
  meta: CriterionCategoryMeta
  criterions: readonly RegisteredCriterion[]
  selectedCriterion?: CRITERION_TYPE
  onCriterionSelect: (criterionType: CRITERION_TYPE) => void
  onIntersectionChange: (category: CRITERION_CATEGORY, ratio: number) => void
}

function CategorySection({
  category,
  meta,
  criterions,
  selectedCriterion,
  onCriterionSelect,
  onIntersectionChange,
}: CategorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onIntersectionChange(category, entry.intersectionRatio)
        })
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px',
      },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [category, onIntersectionChange])

  return (
    <section ref={sectionRef} data-category={category}>
      {/* Category Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          {meta.icon && (
            <span className="text-xl" role="img" aria-label={meta.label}>
              {meta.icon}
            </span>
          )}
          <h3 className="text-lg font-semibold">{meta.label}</h3>
          <Badge variant="secondary" className="ml-auto">
            {criterions.length}
          </Badge>
        </div>
        {meta.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {meta.description}
          </p>
        )}
      </div>

      {/* Criterion List */}
      {criterions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center text-muted-foreground">
          <p className="text-sm">此分類目前沒有可用條件</p>
        </div>
      ) : (
        <div className="space-y-2">
          {criterions.map((criterion) => {
            const isSelected = selectedCriterion === criterion.type

            return (
              <Card
                key={criterion.type}
                data-criterion={criterion.type}
                onClick={() => onCriterionSelect(criterion.type)}
                className={cn(
                  'cursor-pointer transition-all',
                  'hover:border-primary hover:shadow-sm',
                  isSelected && 'border-primary bg-accent',
                )}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-medium">
                    {criterion.name}
                  </CardTitle>
                  {criterion.meta?.description && (
                    <CardDescription>
                      {criterion.meta.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function CriterionList({
  selectedCriterion,
  onCriterionSelect,
  onIntersectionChange,
  className,
}: CriterionListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to selected criterion on mount (for edit mode)
  useEffect(() => {
    if (!selectedCriterion || !containerRef.current) return

    const viewport = containerRef.current.querySelector(
      '[data-radix-scroll-area-viewport]',
    )
    if (!viewport) return

    const criterionElement = viewport.querySelector(
      `[data-criterion="${selectedCriterion}"]`,
    )
    if (criterionElement) {
      criterionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedCriterion])

  return (
    <div ref={containerRef} className={cn('flex-1', className)}>
      <ScrollArea className="h-full">
        <div className="space-y-6 p-6">
          {Object.entries(criterionCategoryConfig).map(([key, meta], index) => {
            const category = key as CRITERION_CATEGORY

            return (
              <div key={category}>
                <CategorySection
                  category={category}
                  meta={meta}
                  criterions={meta.criterions}
                  selectedCriterion={selectedCriterion}
                  onCriterionSelect={onCriterionSelect}
                  onIntersectionChange={onIntersectionChange}
                />
                {index < Object.keys(criterionCategoryConfig).length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
