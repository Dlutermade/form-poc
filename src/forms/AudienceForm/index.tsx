import { AudienceFormDemo } from './Demo'
import { useAudienceForm } from './form'

const AudienceForm = () => {
  const form = useAudienceForm({})

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">受眾表單</h4>
      <AudienceFormDemo />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      ></form>
    </div>
  )
}

export default AudienceForm
