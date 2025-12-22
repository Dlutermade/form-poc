import DynamicForm from '@/forms/DynamicForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bill-demo/dynamic/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <DynamicForm />
    </div>
  )
}
