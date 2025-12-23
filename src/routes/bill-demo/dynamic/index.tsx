import { createFileRoute } from '@tanstack/react-router'
import DynamicForm from '@/forms/DynamicForm'

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
