import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FaXTwitter, FaLinkedin } from 'react-icons/fa6'

const PoweredBy = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.footer.poweredBy.title')}
      </div>
      <hr className='border-b border-dial-angel'/>
      <div className='flex gap-x-8'>
        <a href='//dial.global' target='_blank' rel='noreferrer'>
          <img
            src='/ui/v1/dial-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'DIAL' })}
            width={96}
            className='object-contain'
          />
        </a>
        <div className='text-sm text-dial-stratos'>
          {format('ui.footer.poweredBy.subTitle')}
        </div>
      </div>
      <div className='flex gap-2 ml-auto'>
        <a href='//x.com/DIALCommunity' target='_blank' rel='noreferrer'>
          <FaXTwitter size='2rem' className='text-dial-iris-blue'/>
        </a>
        <a
          href='//www.linkedin.com/company/digital-impact-alliance/'
          target='_blank'
          rel='noreferrer'
        >
          <FaLinkedin size='2rem' className='text-dial-iris-blue'/>
        </a>
      </div>
    </div>
  )
}

export default PoweredBy
