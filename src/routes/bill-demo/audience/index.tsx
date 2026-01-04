import AudienceForm from '@/forms/AudienceForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bill-demo/audience/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <AudienceForm />
    </div>
  )
}
