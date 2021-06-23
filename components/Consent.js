import { useIntl } from 'react-intl'
import { useCookies } from 'react-cookie'

const Consent = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [cookies, setCookie] = useCookies(['consentAccepted'])

  const handleDismiss = (e) => {
    setCookie('consentAccepted', true, { path: '/' })
  }

  return (
    <div className='block'>
      {
        !cookies.consentAccepted &&
          <div className='w-full bg-dial-gray-dark fixed bottom-0 right-0 left-0 z-80'>
            <div className='flex justify-center py-4'>
              <div className='text-dial-gray-light my-auto'>
                {format('consent.text')}
              </div>
              <button
                className='bg-dial-gray-light text-dial-gray-dark py-2 px-4 rounded inline-flex items-center mx-4'
                onClick={handleDismiss}
              >
                {format('consent.dismiss')}
              </button>
              <a href='/what-is-cookies' className='my-auto text-dial-teal border-b border-transparent hover:border-dial-yellow' target='_blank'>
                {format('consent.learnMore')}
              </a>
            </div>
          </div>
      }
    </div>
  )
}

export default Consent
