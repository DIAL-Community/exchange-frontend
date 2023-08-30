import { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

const StorefrontDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-6 py-4'>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('ui.storefront.hint.title')}
        </div>
        <div className='text-sm flex flex-col gap-y-3 text-dial-stratos'>
          <FormattedMessage
            id='ui.storefront.hint.subtitle'
            values={{
              p: chunks => <p className='text-justify'>{chunks}</p>,
              div: chunks => <div className='text-xs italic ml-4 px-4 py-3 bg-dial-cotton'>{chunks}</div>,
              sub: chunks => <div>{chunks}</div>,
              span: chunks => <span>{chunks}</span>,
              li: chunks => <li>{chunks}</li>,
              ul: chunks => <ul className='pl-4 list-outside list-disc flex flex-col gap-y-2'>{chunks}</ul>,
              a: chunks => (
                <a
                  class='border-b border-dial-stratos'
                  target='_blank'
                  href='/playbooks'
                >
                  {chunks}
                </a>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default StorefrontDefinition
