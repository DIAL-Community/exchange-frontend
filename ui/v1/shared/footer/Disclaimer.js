import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Disclaimer = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-2 py-3'>
      <a
        href='/privacy-policy'
        target='_blank'
        rel='noreferrer'
        className='ml-auto'
      >
        <div className='text-sm text-dial-stratos'>
          {format('ui.footer.disclaimer.privacyPolicy')}
        </div>
      </a>
      <div className='text-sm text-dial-stratos ml-auto'>
        {format('ui.footer.disclaimer.termsOfUse')}
      </div>
      <div className='text-sm text-dial-stratos ml-auto'>
        {format('ui.footer.disclaimer.copyright', { year: new Date().getFullYear() })}
      </div>
    </div>
  )
}

export default Disclaimer
