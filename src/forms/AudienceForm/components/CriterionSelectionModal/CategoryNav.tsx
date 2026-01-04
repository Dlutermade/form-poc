import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  criterionCategoryConfig,
  type CRITERION_CATEGORY,
} from '../../criterion/categories'

export type CategoryNavProps = {
  categoriesIntersectionRate: Partial<Record<CRITERION_CATEGORY, number>>
  onCategoryClick: (category: CRITERION_CATEGORY) => void
  className?: string
}

export function CategoryNav({
  categoriesIntersectionRate,
  onCategoryClick,
  className,
}: CategoryNavProps) {
  // Find category with highest intersection ratio
  const activeCategory = useMemo(() => {
    let maxCategory: CRITERION_CATEGORY | null = null
    let maxRatio = 0

    Object.entries(categoriesIntersectionRate).forEach(([category, ratio]) => {
      if (ratio && ratio >= maxRatio && ratio > 0.1) {
        maxRatio = ratio
        maxCategory = category as CRITERION_CATEGORY
      }
    })

    return maxCategory
  }, [categoriesIntersectionRate])

  return (
    <nav className={cn('flex flex-col gap-1 p-4', className)}>
      {Object.entries(criterionCategoryConfig).map(([key, meta]) => {
        const category = key as CRITERION_CATEGORY
        const isActive = activeCategory === category

        return (
          <button
            key={category}
            onClick={() => onCategoryClick(category)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground',
            )}
          >
            {meta.icon && (
              <span className="text-lg" role="img" aria-label={meta.label}>
                {meta.icon}
              </span>
            )}
            <span className="truncate">{meta.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
