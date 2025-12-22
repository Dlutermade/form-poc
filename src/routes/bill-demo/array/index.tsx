import ArrayForm from '@/forms/ArrayForm'
import { createFileRoute } from '@tanstack/react-router'

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
