import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CriterionSelectionModal } from './components/CriterionSelectionModal'
import type { CRITERION_TYPE } from './criterion'

export function AudienceFormDemo() {
  // Controlled mode state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCriterionControlled, setSelectedCriterionControlled] =
    useState<CRITERION_TYPE | undefined>()

  // Uncontrolled mode state
  const [selectedCriterionUncontrolled, setSelectedCriterionUncontrolled] =
    useState<CRITERION_TYPE | undefined>()

  const handleControlledSelect = (criterionType: CRITERION_TYPE) => {
    console.log(`[Controlled] Selected: ${criterionType}`)
    setSelectedCriterionControlled(criterionType)
  }

  const handleUncontrolledSelect = (criterionType: CRITERION_TYPE) => {
    console.log(`[Uncontrolled] Selected: ${criterionType}`)
    setSelectedCriterionUncontrolled(criterionType)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Audience Form Demo - CriterionSelectionModal
      </h1>
      <p className="text-muted-foreground mb-8">
        展示 Modal 的兩種使用模式:受控模式 (Controlled) 與非受控模式
        (Uncontrolled)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controlled Mode */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">受控模式 (Controlled)</h2>
            <Badge variant="outline">open + onOpenChange</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            你完全控制 Modal 的開關狀態,適合需要程式邏輯觸發的場景
          </p>

          <div className="space-y-2">
            <Button onClick={() => setIsModalOpen(true)}>新增條件</Button>

            {selectedCriterionControlled && (
              <div className="p-4 border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground mb-2">
                  目前選擇的條件:
                </p>
                <p className="font-mono text-sm font-semibold mb-3">
                  {selectedCriterionControlled}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                  >
                    編輯條件
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCriterionControlled(undefined)}
                  >
                    清除
                  </Button>
                </div>
              </div>
            )}
          </div>

          <CriterionSelectionModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onSelect={handleControlledSelect}
            currentCriterionType={selectedCriterionControlled}
          />
        </div>

        {/* Uncontrolled Mode */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">非受控模式 (Uncontrolled)</h2>
            <Badge variant="outline">trigger</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Modal 內部自動管理開關狀態,只需提供 trigger
            按鈕,適合簡單的按鈕觸發場景
          </p>

          <div className="space-y-2">
            <CriterionSelectionModal
              trigger={<Button>新增條件 (Uncontrolled)</Button>}
              onSelect={handleUncontrolledSelect}
              currentCriterionType={selectedCriterionUncontrolled}
            />

            {selectedCriterionUncontrolled && (
              <div className="p-4 border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground mb-2">
                  目前選擇的條件:
                </p>
                <p className="font-mono text-sm font-semibold mb-3">
                  {selectedCriterionUncontrolled}
                </p>
                <div className="flex gap-2">
                  <CriterionSelectionModal
                    trigger={
                      <Button variant="outline" size="sm">
                        編輯條件
                      </Button>
                    }
                    onSelect={handleUncontrolledSelect}
                    currentCriterionType={selectedCriterionUncontrolled}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCriterionUncontrolled(undefined)}
                  >
                    清除
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">程式碼範例</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">受控模式:</p>
            <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
              {`<CriterionSelectionModal
  open={isOpen}
  onOpenChange={setIsOpen}
  onSelect={handleSelect}
  currentCriterionType={type}
/>`}
            </pre>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">非受控模式:</p>
            <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
              {`<CriterionSelectionModal
  trigger={<Button>開啟</Button>}
  onSelect={handleSelect}
  currentCriterionType={type}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
