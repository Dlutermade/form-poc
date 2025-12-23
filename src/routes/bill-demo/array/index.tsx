import { createFileRoute } from '@tanstack/react-router'
import ArrayForm from '@/forms/ArrayForm'

export const Route = createFileRoute('/bill-demo/array/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ArrayForm />
    </div>
  )
}
