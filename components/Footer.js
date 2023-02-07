import { useState } from 'react'
import Image from 'next/image'
import { FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import ReportIssue from './shared/ReportIssue'

const Consent = dynamic(() => import('./Consent'), { ssr: false })

const Footer = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [formTitle, setFormTitle] = useState('')
  const [showForm, setShowForm] = useState(false)

  const showFeedbackForm = (title) => {
    setFormTitle(title)
    setShowForm(true)
  }

  const hideFeedbackForm = () => {
    setShowForm(false)
  }

  return (
    <footer>
      <Consent />
      <div className='max-w-catalog mx-auto bg-dial-blue-chalk text-dial-stratos'>
        <div className='flex flex-col lg:flex-row gap-x-24 gap-y-8 py-12 px-20'>
          <div className='w-full lg:w-3/12 flex flex-col gap-y-8'>
            <div className='text-xl font-semibold'>{format('footer.connectWithUs')}</div>
            <hr className='border border-footer-delimiter' />
            <div className='text-base'>
              {format('footer.signUpEmailAddress')}
            </div>
            <div>
              <button type='submit' className='py-2 px-5 rounded-md bg-dial-yellow font-semibold'>
                {format('app.submit')}
              </button>
            </div>
          </div>
          <div className='w-full lg:w-2/12 flex flex-col gap-y-8'>
            <div className='text-xl font-semibold'>{format('footer.followUs')}</div>
            <hr className='border border-footer-delimiter' />
            <div className='flex gap-4'>
              <a href='//twitter.com/DIAL_Community' target='_blank' rel='noreferrer'>
                <FaTwitter size={32} />
              </a>
              <a href='//www.linkedin.com/company/digital-impact-alliance/' target='_blank' rel='noreferrer'>
                <FaLinkedinIn size={32} />
              </a>
            </div>
          </div>
          <div className='w-full lg:w-7/12 flex flex-col gap-y-8'>
            <div className='text-xl font-semibold'>{format('footer.partnersAndSupporters')}</div>
            <hr className='border border-footer-delimiter' />
            <div className='flex gap-4 place-content-around'>
              <div className='w-36 bg-white rounded-md border-dial-white-beech-light flex place-content-around'>
                <div className='self-center px-4'>
                  <a href='//unfoundation.org/' target='_blank' rel='noreferrer'>
                    <Image
                      src='/images/footer/unf-logo.png'
                      width={246}
                      height={59}
                      alt='The United Nations Foundation Logo'
                    />
                  </a>
                </div>
              </div>
              <div className='w-36 bg-white rounded-md border-dial-white-beech-light flex place-content-around'>
                <div className='self-center px-4'>
                  <a href='//www.gatesfoundation.org/' target='_blank' rel='noreferrer'>
                    <Image
                      src='/images/footer/bill-n-melinda-logo.png'
                      width={204}
                      height={40}
                      alt='The Bill & Melinda Gates Foundation'
                    />
                  </a>
                </div>
              </div>
              <div className='w-36 bg-white rounded-md border-dial-white-beech-light flex place-content-around'>
                <div className='self-center px-10'>
                  <a href='//www.sida.se/' target='_blank' rel='noreferrer'>
                    <Image
                      src='/images/footer/sida-logo.png'
                      width={102}
                      height={100}
                      alt='The Swedish International Development Cooperation Agency Logo'
                    />
                  </a>
                </div>
              </div>
              <div className='w-36 bg-white rounded-md border-dial-white-beech-light flex place-content-around'>
                <div className='self-center px-12 mt-3'>
                  <a
                    href='//www.gov.uk/government/organisations/foreign-commonwealth-development-office'
                    target='_blank' rel='noreferrer'
                  >
                    <Image
                      src='/images/footer/fcdo-logo.png'
                      height={60}
                      width={60}
                      alt='The Foreign, Commonwealth & Development Office Logo'
                    />
                  </a>
                </div>
              </div>
              <div className='w-36 bg-white rounded-md border-dial-white-beech-light flex place-content-around'>
                <div className='self-center px-2'>
                  <a href='//www.giz.de/' target='_blank' rel='noreferrer'>
                    <Image
                      src='/images/footer/giz-logo.png'
                      width={1570}
                      height={879}
                      alt='The German Corporation for International Cooperation GmbH Logo'
                    />
                  </a>
                </div>
              </div>
              <div className='w-36 bg-white rounded-md border-dial-white-beech-light flex place-content-around'>
                <div className='self-center px-1'>
                  <a href='//www.bmz.de/' target='_blank' rel='noreferrer'>
                    <Image
                      src='/images/footer/bmz-logo.png'
                      width={1152}
                      height={536}
                      alt='The Federal Ministry for Economic Cooperation and Development Logo'
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className='ml-auto pt-8 flex flex-row flex-wrap gap-3'>
              <div className='group hover:cursor-pointer'>
                <a
                  href='/privacy-policy'
                  target='_blank'
                  rel='noreferrer'
                  className='border-b-2 border-transparent group-hover:border-dial-yellow'
                >
                  {format('footer.privacyPolicy')}
                </a>
              </div>
              <div className='border-r border-footer-delimiter' />
              <div className='group rounded-md hover:cursor-pointer'>
                <a
                  onClick={(e) => { e.preventDefault(); showFeedbackForm('footer.contactUs') }}
                  className='border-b-2 border-transparent group-hover:border-dial-yellow'
                >
                  {format('footer.contactUs')}
                </a>
              </div>
              <div className='border-r border-footer-delimiter' />
              <div className='block'>
                &copy; {new Date().getFullYear()} {format('footer.organizationName')}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForm &&
        <ReportIssue
          showForm={showForm}
          hideFeedbackForm={() => hideFeedbackForm()}
          formTitle={format(formTitle)}
        />
      }
    </footer>
  )
}

export default Footer
