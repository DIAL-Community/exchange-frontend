import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'

const WorkflowDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-6 py-4'>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('workflow.hint.title')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {format('workflow.hint.subtitle')}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('workflow.hint.characteristicTitle')}
        </div>
        <div className='text-sm text-dial-stratos fr-view'>
          {parse(format('workflow.hint.characteristics'))}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('workflow.hint.descriptionTitle')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {parse(format('workflow.hint.description'))}
        </div>
      </div>
    </div>
  )
}

export default WorkflowDefinition
