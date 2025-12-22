import { createFileRoute } from '@tanstack/react-router'
import SimpleForm from '@/forms/SimpleForm'

export const Route = createFileRoute('/bill-demo/simple/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <SimpleForm />
    </div>
  )
}
