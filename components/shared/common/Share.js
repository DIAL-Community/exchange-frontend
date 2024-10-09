import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../../lib/ToastContext'

const Share = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showSuccessMessage } = useContext(ToastContext)

  const shareToLinkedIn = () => {
    const url = window.location.href
    const text = format('ui.share.linkedinText', { url })
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`
    window.open(linkedInUrl, '_blank')
  }

  const shareToEmail = () => {
    const url = window.location.href
    const text = format('ui.share.emailText', { url })
    const emailUrl = `mailto:?subject=${text}&body=${url}`
    window.open(emailUrl, '_blank')
  }

  const shareToWhatsApp = () => {
    const url = 'https://google.com'
    const text = format('ui.share.whatsApp', { url })
    const whatsAppUrl = `https://wa.me/?text=${text}`
    window.open(whatsAppUrl, '_blank')
  }

  const copyCurrentUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    showSuccessMessage(format('ui.share.copyLink.success'))
  }

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-dial-sapphire font-semibold'>
        {format('ui.share.title')}
      </div>
      <div className='flex flex-row gap-3'>
        <button onClick={shareToWhatsApp}>
          <img
            src='/ui/v1/whatsapp-icon.svg'
            alt={format('ui.image.logoAlt', { name: 'WhatsApp' })}
            width={40}
            height={40}
            className='object-contain'
          />
        </button>
        <button onClick={shareToLinkedIn}>
          <img
            src='/ui/v1/linkedin-icon.svg'
            alt={format('ui.image.logoAlt', { name: 'LinkedIn' })}
            width={40}
            height={40}
            className='object-contain'
          />
        </button>
        <button onClick={shareToEmail}>
          <img
            src='/ui/v1/email-icon.svg'
            alt={format('ui.image.logoAlt', { name: 'Email' })}
            width={40}
            height={40}
            className='object-contain'
          />
        </button>
        <button onClick={copyCurrentUrl}>
          <img
            src='/ui/v1/copy-icon.svg'
            alt={format('ui.image.logoAlt', { name: 'Copy' })}
            width={40}
            height={40}
            className='object-contain'
          />
        </button>
      </div>
    </div>
  )
}

export default Share
