import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bill-demo/stepper/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="m-5">
      <div className="mt-8 pt-8 border-t">
        <h5 className="font-semibold mb-2">參考資料:</h5>
        <a
          className="text-blue-500 hover:text-blue-700 block"
          href="https://github.com/TanStack/form/issues/419"
          target="_blank"
          rel="noopener noreferrer"
        >
          方案一 等 GitHub Issue #419 RFC 通過後發布的版本
        </a>
        <a
          className="text-blue-500 hover:text-blue-700 block"
          href="https://www.formity.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          方案二 透過 Formity
        </a>
      </div>
    </div>
  )
}
