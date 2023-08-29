import { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

const OpportunityDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-6 py-4'>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('ui.opportunity.hint.title')}
        </div>
        <div className='flex flex-col gap-y-3 text-dial-stratos'>
          <FormattedMessage
            id='ui.opportunity.hint.subtitle'
            values={{
              p: chunks => <p className='text-justify'>{chunks}</p>,
              li: chunks => <li>{chunks}</li>,
              ul: chunks => <ul className='pl-4 list-outside list-disc flex flex-col gap-y-2'>{chunks}</ul>
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default OpportunityDefinition
