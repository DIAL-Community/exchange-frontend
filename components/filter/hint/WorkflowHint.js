import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'

const WorkflowHint = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-2 text-dial-stratos'>
      <div className='text-xl font-semibold'>
        {format('workflow.label')}
      </div>
      <div className='text-base'>
        {format('workflow.hint.subtitle')}
      </div>
      <div className='mx-auto'>
        <Image
          height={200}
          width={200}
          src='/images/tiles/workflow.svg'
          alt='Workflow hint logo.' />
      </div>
      <div className='text-lg font-semibold'>
        {format('workflow.hint.characteristicTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {parse(format('workflow.hint.characteristics'))}
      </div>
      <div className='text-lg font-semibold'>
        {format('workflow.hint.descriptionTitle').toUpperCase()}
      </div>
      <div className='text-sm'>
        {format('workflow.hint.description')}
      </div>
    </div>
  )
}

export default WorkflowHint
