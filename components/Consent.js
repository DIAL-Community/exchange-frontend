import { useIntl } from 'react-intl'
import { useCookies } from 'react-cookie'

const Consent = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [cookies, setCookie] = useCookies(['consentAccepted'])

  const handleDismiss = (e) => {
    setCookie('consentAccepted', true, { path: '/' })
  }

  return (
    <div className='block'>
      {
        !cookies.consentAccepted &&
          <div className='w-full bg-dial-gray-dark fixed bottom-0 right-0 left-0 z-80'>
            <div className='flex flex-col md:flex-row justify-center py-4 mx-4 gap-3'>
              <div className='text-dial-gray-light my-auto'>
                {format('consent.text')}
              </div>
              <div className='flex justify-center gap-4'>
                <button
                  className='text-button-gray bg-dial-yellow rounded inline-flex items-center py-2 px-4'
                  onClick={handleDismiss}
                >
                  {format('consent.dismiss')}
                </button>
                <a
                  className='my-auto text-dial-yellow border-b-2 border-transparent hover:border-dial-yellow' target='_blank'
                  href='/what-is-cookies'
                >
                  {format('consent.learnMore')}
                </a>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default Consent
