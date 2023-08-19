import { useState } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import ReportIssue from './ReportIssue'

const Consent = dynamic(() => import('./Consent'), { ssr: false })

const EmbeddedFooter = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [showForm, setShowForm] = useState(false)

  return (
    <footer>
      <Consent />
      <div className='relative w-full bg-dial-gray text-dial-purple-light leading-none text-base'>
        <div className='px-4 pt-4 pb-8 lg:px-10 2xl:px-24 2xl:pt-8 2xl:pb-12 flex flex-row flex-wrap mx-auto'>
          <div className='w-full flex flex-row flex-wrap gap-3 leading-none text-base place-content-center'>
            <div className='py-2 px-0 2xl:px-2 text-center'>
              <span>{format('footer.icons')} </span>
              <a
                className='border-b-2 border-transparent hover:border-dial-sunshine'
                href='https://fontawesome.com/' target='_blank' rel='noreferrer'
              >
                FontAwesome
              </a>
              <span> and </span>
              <a
                className='border-b-2 border-transparent hover:border-dial-sunshine'
                href='https://www.globalgoals.org/' target='_blank' rel='noreferrer'
              >
                The Global Goals for Sustainable Development
              </a>
            </div>
          </div>
          <div className='w-full flex flex-row flex-wrap gap-3 leading-none text-base place-content-center'>
            <div className='py-2 order-last xl:order-first'>
              &copy; {new Date().getFullYear()} {format('footer.organizationName').toUpperCase()}
            </div>
            <div className='py-2 px-3 rounded-md bg-dial-gray-light'>
              <a
                href='/privacy-policy'
                target='_blank' rel='noreferrer'
                className='border-b-2 border-transparent hover:border-dial-sunshine'
              >
                {format('footer.privacyPolicy').toUpperCase()}
              </a>
            </div>
            <div className='py-2 px-3 rounded-md bg-dial-gray-light' onClick={() => setShowForm(true)}>
              {format('app.reportIssue').toUpperCase()}
              {showForm && <ReportIssue showForm={showForm} setShowForm={setShowForm} />}
            </div>
            <div className='py-2 px-3 rounded-md bg-dial-gray-light' onClick={() => setShowForm(true)}>
              {format('footer.contactUs').toUpperCase()}
              {showForm && <ReportIssue showForm={showForm} setShowForm={setShowForm} />}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default EmbeddedFooter
