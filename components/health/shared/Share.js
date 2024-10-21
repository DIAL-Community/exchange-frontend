import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { CiLink } from 'react-icons/ci'
import { TiSocialLinkedin } from 'react-icons/ti'
import { CiMail } from 'react-icons/ci'
import { FaWhatsapp } from 'react-icons/fa'
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
        <button onClick={shareToLinkedIn}>
          <TiSocialLinkedin
            className='w-10 h-10 bg-health-blue fill-white rounded-full'
            viewBox="-3 -3 30 30"
          />
        </button>
        <button onClick={shareToWhatsApp}>
          <FaWhatsapp
            className='w-10 h-10 bg-health-blue fill-white rounded-full'
            viewBox="-80 -80 600 680"
          />
        </button>
        <button onClick={shareToEmail}>
          <CiMail
            className='w-10 h-10 bg-health-blue fill-white rounded-full'
            viewBox="-6 -6 36 36"
          />
        </button>
        <button onClick={copyCurrentUrl}>
          <CiLink
            className='w-10 h-10 bg-health-blue fill-white rounded-full'
            viewBox="-6 -6 36 36"
          />
        </button>
      </div>
    </div>
  )
}

export default Share
