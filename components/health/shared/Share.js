import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { AiFillTwitterCircle } from 'react-icons/ai'
import { TiSocialLinkedin } from 'react-icons/ti'
import { CiMail } from 'react-icons/ci'
import { FaWhatsapp } from 'react-icons/fa'

const Share = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-black font-semibold'>
        {format('ui.share.title')}
      </div>
      <div className='flex flex-row gap-3 align-center'>
        <AiFillTwitterCircle
          className='w-11 h-11 fill-health-blue'
        />
        <TiSocialLinkedin
          className='w-10 h-10 bg-health-blue fill-white rounded-full'
          viewBox="-3 -3 30 30"
        />
        <FaWhatsapp
          className='w-10 h-10 bg-health-blue fill-white rounded-full'
          viewBox="-80 -80 600 680"
        />
        <CiMail
          className='w-10 h-10 bg-health-blue fill-white rounded-full'
          viewBox="-6 -6 36 36"
        />
      </div>
    </div>
  )
}

export default Share
