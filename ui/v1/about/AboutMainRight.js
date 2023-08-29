import { FormattedMessage, useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'

const AboutMainRight = forwardRef((props, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const theExchangeRef = useRef()
  const theVisionRef = useRef()
  const theBeyondRef = useRef()
  const thePartnerRef = useRef()
  const theTeamRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.about.theExchange', ref: theExchangeRef },
      { value: 'ui.about.theVision', ref: theVisionRef },
      { value: 'ui.about.theBeyond', ref: theBeyondRef },
      { value: 'ui.about.thePartner', ref: thePartnerRef },
      { value: 'ui.about.theTeam', ref: theTeamRef }
    ],
    []
  )

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo(0, 0)
  }

  return (
    <div className='min-h-[50vh] text-base'>
      <div className='flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-2 pt-4'>
          <div className='text-2xl font-bold text-dial-stratos' ref={theExchangeRef}>
            {format('ui.about.theExchange')}
          </div>
          <div className='text-lg italic'>
            {format('ui.about.theExchange.subtext')}
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <FormattedMessage
            id='ui.about.theExchange.description'
            values={{
              p: chunks => <p className='text-justify'>{chunks}</p>,
              li: chunks => <li>{chunks}</li>,
              ul: chunks => <ul className='pl-4 list-inside list-disc'>{chunks}</ul>
            }}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='text-xl font-semibold text-dial-stratos' ref={theVisionRef}>
          {format('ui.about.theVision')}
        </div>
        <div className='flex flex-col gap-3'>
          <FormattedMessage
            id='ui.about.theVision.description'
            values={{
              p: chunks => <p className='text-justify'>{chunks}</p>
            }}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='text-xl font-semibold text-dial-stratos' ref={theBeyondRef}>
          {format('ui.about.theBeyond')}
        </div>
        <div className='flex flex-col gap-3'>
          <FormattedMessage
            id='ui.about.theBeyond.description'
            values={{
              p: chunks => <p className='text-justify'>{chunks}</p>
            }}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='text-xl font-semibold text-dial-stratos' ref={thePartnerRef}>
          {format('ui.about.thePartner')}
        </div>
        <div className='flex flex-col gap-3'>
          <FormattedMessage
            id='ui.about.thePartner.description'
            values={{
              p: chunks => <p className='text-justify'>{chunks}</p>,
              li: chunks => <li>{chunks}</li>,
              ul: chunks => <ul className='pl-4 list-inside list-disc'>{chunks}</ul>,
              strong: chunks => <strong>{chunks}</strong>,
              a: chunks => (
                <a
                  class='border-b border-dial-stratos'
                  target='_blank'
                  href='//www.govstack.global/'
                >
                  {chunks}
                </a>
              )
            }}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='text-xl font-semibold text-dial-stratos' ref={theTeamRef}>
          {format('ui.about.theTeam')}
        </div>
        <div className='flex flex-col gap-3'>
          <FormattedMessage
            id='ui.about.theTeam.description'
            values={{
              p: chunks => <p className='text-justify'>{chunks}</p>,
              strong: chunks => <strong>{chunks}</strong>
            }}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='mx-auto text-sm'>
          <a href='#' onClick={scrollToTop} className='border-b border-dial-iris-blue'>
            {format('ui.common.scrollToTop')}
          </a>
        </div>
      </div>
    </div>
  )
})

AboutMainRight.displayName = 'AboutMainRight'

export default AboutMainRight
