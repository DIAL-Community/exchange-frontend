import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'

const PlaybookDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-6 py-4'>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-meadow'>
          {format('ui.playbook.whatIs')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {format('ui.playbook.hint.subtitle')}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-meadow'>
          {format('ui.playbook.hint.characteristicTitle')}
        </div>
        <div className='text-sm text-dial-stratos fr-view'>
          {parse(format('ui.playbook.hint.characteristics'))}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-meadow'>
          {format('ui.playbook.hint.descriptionTitle')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {parse(format('ui.playbook.hint.description'))}
        </div>
      </div>
    </div>
  )
}

export default PlaybookDefinition
