import { useIntl } from 'react-intl'
import { useCookieConsentContext } from '@use-cookie-consent/react'
import { useState } from 'react'
import Cookies from 'js-cookie'

const Consent = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [showCookies, setShowCookies] = useState(false)
  const [essential, setEssential] = useState(true)
  const [statistics, setStatistics] = useState(true)
  const { consent, acceptAllCookies, acceptCookies } = useCookieConsentContext()

  const handleAccept = () => {
    acceptAllCookies()
  }

  const toggleEssential = () => {
    setEssential(!essential)
  }

  const toggleStatistics = () => {
    setStatistics(!statistics)
  }

  const toggleShowCookies = () => {
    setShowCookies(!showCookies)
  }

  const saveCookies = () => {
    acceptCookies({
      session: essential,
      persistence: essential,
      necessary: essential,
      preference: essential,
      firstParty: essential,
      thirdParty: statistics,
      marketing: statistics,
      statistics
    })
    if (!statistics) {
      // Disable Google Analytics if they do not accept statistics
      Cookies.remove('_ga', { path: '/' })
      Cookies.remove(`_ga_${process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID.replaceAll('-', '_')}`, { path: '/' })
      Cookies.remove('_gid', { path: '/' })
    }
  }

  return (
    <div className='block'>
      {
        typeof consent.firstParty === 'undefined' &&
          <div className='w-full bg-dial-gray-dark fixed bottom-0 right-0 left-0 z-80'>
            <div className='flex flex-col md:flex-row justify-center py-4 mx-4 gap-3'>
              <div className='text-dial-gray-light my-auto'>
                {format('consent.text')}
              </div>
              <div className='flex justify-center gap-4'>
                <button
                  type='button'
                  className='text-dial-stratos bg-dial-sunshine rounded inline-flex items-center py-2 px-4'
                  onClick={handleAccept}
                >
                  {format('consent.acceptAll')}
                </button>
                <button
                  type='button'
                  className='text-dial-stratos bg-dial-sunshine rounded inline-flex items-center py-2 px-4'
                  onClick={toggleShowCookies}
                >
                  {format('consent.cookieDetails')}
                </button>
                <a
                  className='my-auto text-dial-sunshine border-b-2 border-transparent hover:border-dial-sunshine'
                  target='_blank'
                  href='/privacy-policy'
                >
                  {format('consent.privacyPolicy')}
                </a>
              </div>
            </div>
            <div className={`${showCookies ? 'block' : 'hidden'}`}>
              <div className='flex flex-col md:flex-row justify-center py-4 mx-4 gap-3'>
                <label className='inline-flex items-center'>
                  <input
                    type='checkbox' className='h-4 w-4 form-checkbox text-white' name='essential'
                    checked={essential} onChange={toggleEssential}
                  />
                  <span className='ml-2 text-white'>{format('consent.essential')}</span>
                </label>
                <label className='inline-flex items-center'>
                  <input
                    type='checkbox' className='h-4 w-4 form-checkbox text-white' name='essential'
                    checked={statistics} onChange={toggleStatistics}
                  />
                  <span className='ml-2 text-white'>{format('consent.statistics')}</span>
                </label>
                <button
                  type='button'
                  className='text-dial-stratos bg-dial-sunshine rounded inline-flex items-center py-2 px-4'
                  onClick={saveCookies}
                >
                  {format('consent.save')}
                </button>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default Consent
