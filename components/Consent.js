import { useIntl } from 'react-intl'
import { useCookieConsent } from '@use-cookie-consent/core'
import { useState } from 'react'
import cookie from 'react-cookies'

const Consent = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [showCookies, setshowCookies] = useState(false)
  const [essential, setEssential] = useState(true)
  const [statistics, setStatistics] = useState(true)
  const { consent, acceptAllCookies, acceptCookies } = useCookieConsent()

  const handleAccept = () => {
    acceptAllCookies()
    // acceptCookies({ thirdParty: true })
  }

  const toggleEssential = (e) => {
    e.preventDefault()
    setEssential(!essential)
  }

  const toggleStatistics = (e) => {
    e.preventDefault()
    setStatistics(!statistics)
  }

  const toggleShowCookies = (e) => {
    e.preventDefault()
    setshowCookies(!showCookies)
  }

  const saveCookies = (e) => {
    e.preventDefault()
    acceptCookies({ necessary: essential, session: essential, firstParty: essential, thirdParty: statistics, statistics })
    if (!statistics) {
      // Disable Google Analytics if they do not accept statistics
      cookie.remove('_ga', { path: '/' })
      cookie.remove('_gat_gtag_' + process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID.replaceAll('-', '_'), { path: '/' })
      cookie.remove('_gid', { path: '/' })
    }
  }

  return (
    <div className='block'>
      {
        Object.keys(consent).length === 0 &&
          <div className='w-full bg-dial-gray-dark fixed bottom-0 right-0 left-0 z-80'>
            <div className='flex flex-col md:flex-row justify-center py-4 mx-4 gap-3'>
              <div className='text-dial-gray-light my-auto'>
                {format('consent.text')}
              </div>
              <div className='flex justify-center gap-4'>
                <button
                  className='text-button-gray bg-dial-yellow rounded inline-flex items-center py-2 px-4'
                  onClick={handleAccept}
                >
                  {format('consent.acceptAll')}
                </button>
                <button
                  className='text-button-gray bg-dial-yellow rounded inline-flex items-center py-2 px-4'
                  onClick={toggleShowCookies}
                >
                  {format('consent.cookieDetails')}
                </button>
                <a
                  className='my-auto text-dial-yellow border-b-2 border-transparent hover:border-dial-yellow' target='_blank'
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
                  className='text-button-gray bg-dial-yellow rounded inline-flex items-center py-2 px-4'
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
