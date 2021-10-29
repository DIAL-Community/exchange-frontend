import Image from 'next/image'
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'

import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'

const Consent = dynamic(() => import('./Consent'), { ssr: false })

const Footer = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  return (
    <footer>
      <Consent />
      <div className='relative w-full bg-dial-gray-light text-dial-purple-light'>
        <div className='px-4 2xl:px-24 pt-8 2xl:pb-8 lg:flex lg:flex-row flex-wrap justify-center 2xl:justify-start mx-auto max-w-catalog'>
          <div className='max-w-prose sm:w-full lg:flex-auto sm:mx-auto 2xl:mx-0 lg:my-auto text-center 2xl:text-left'>
            {format('footer.text.firstLine')}
          </div>
          <div className='flex-grow flex flex-row flex-wrap place-content-center'>
            <div className='relative p-2 lg:my-auto'>
              <a href='https://unfoundation.org/' target='_blank' rel='noreferrer'>
                <Image
                  src='/images/footer/unf-logo.png' width={246} height={59}
                  alt='The United Nations Foundation Logo'
                />
              </a>
            </div>
            <div className='relative p-2 m-auto'>
              <a href='https://www.gatesfoundation.org/' target='_blank' rel='noreferrer'>
                <Image
                  src='/images/footer/bill-n-melinda-logo.png' width={244} height={50}
                  alt='The Bill & Melinda Gates Foundation'
                />
              </a>
            </div>
            <div className='relative p-2 m-auto'>
              <a href='https://www.sida.se/' target='_blank' rel='noreferrer'>
                <Image
                  src='/images/footer/sida-logo.png' width={102} height={100}
                  alt='The Swedish International Development Cooperation Agency Logo'
                />
              </a>
            </div>
            <div className='h-20 w-24 relative p-2 m-auto'>
              <a
                href='https://www.gov.uk/government/organisations/foreign-commonwealth-development-office'
                target='_blank' rel='noreferrer'
              >
                <Image
                  src='/images/footer/fcdo-logo.png' layout='fill' objectFit='scale-down'
                  alt='The Foreign, Commonwealth & Development Office Logo'
                />
              </a>
            </div>
          </div>
        </div>
        <div className='2xl:px-24 my-3 xl:my-0'>
          <div className='border border-t-0 border-dial-gray' />
        </div>
        <div className='px-4 2xl:px-24 lg:pt-4 2xl:pb-4 flex flex-row flex-wrap justify-center 2xl:justify-start mx-auto max-w-catalog'>
          <div className='w-full lg:max-w-2/4 2xl:max-w-prose flex-auto my-auto md:text-center 2xl:text-left'>
            {format('footer.text.secondLine')}
          </div>
          <div className='h-auto w-72 relative p-2 my-auto'>
            <a href='https://www.giz.de/' target='_blank' rel='noreferrer'>
              <Image
                src='/images/footer/giz-logo.png' width={1744} height={977}
                alt='The German Corporation for International Cooperation GmbH Logo'
              />
            </a>
          </div>
          <div className='h-auto w-72 relative p-2 my-auto'>
            <a href='https://www.bmz.de/' target='_blank' rel='noreferrer'>
              <Image
                src='/images/footer/bmz-logo.png' width={1280} height={596}
                alt='The Federal Ministry for Economic Cooperation and Development Logo'
              />
            </a>
          </div>
        </div>
      </div>
      <div className='relative w-full bg-dial-gray text-dial-purple-light leading-none text-base'>
        <div className='px-4 pb-4 pt-8 lg:px-10 2xl:pt-12 2xl:pb-8 2xl:px-24 flex flex-row flex-wrap mx-auto max-w-catalog'>
          <div className='py-2 px-3 mr-4 mt-4 rounded-md bg-dial-gray-light'>
            <a
              href='https://digitalimpactalliance.org/contact-us/ict4sdg/'
              target='_blank' rel='noreferrer'
              className='border-b-2 border-transparent hover:border-dial-yellow'
            >
              {format('footer.sign-up')}
            </a>
          </div>
          <div className='py-2 px-3 mr-4 mt-4 rounded-md bg-dial-gray-light'>
            <a
              href='https://forum.osc.dial.community/'
              target='_blank' rel='noreferrer'
              className='border-b-2 border-transparent hover:border-dial-yellow'
            >
              {format('footer.discuss')}
            </a>
          </div>
          <div className='py-2 px-3 mr-4 mt-4 rounded-md bg-dial-gray-light'>
            <a
              href='https://gitlab.com/dial/osc/eng/t4d-online-catalog/product-registry'
              target='_blank' rel='noreferrer'
              className='border-b-2 border-transparent hover:border-dial-yellow'
            >
              {format('footer.view-gitlab')}
            </a>
          </div>
          <div className='flex-grow mt-4 flex flex-row'>
            <div className='py-2 px-0 lg:px-2 rounded-md flex-grow text-right'>
              {format('footer.follow')}
            </div>
            <div className='p-2 rounded-md bg-dial-gray-light mx-2'>
              <a
                className='border-b-2 border-transparent hover:border-dial-yellow'
                href='https://facebook.com/DigitalImpactAlliance' target='_blank' rel='noreferrer'
              >
                <FaFacebookF className='inline' />
              </a>
            </div>
            <div className='p-2 rounded-md bg-dial-gray-light'>
              <a
                href='https://twitter.com/DIAL_Community' target='_blank' rel='noreferrer'
                className='border-b-2 border-transparent hover:border-dial-yellow'
              >
                <FaTwitter className='inline' />
              </a>
            </div>
            <div className='p-2 rounded-md bg-dial-gray-light mx-2'>
              <a
                href='https://www.instagram.com/dial_community' target='_blank' rel='noreferrer'
                className='border-b-2 border-transparent hover:border-dial-yellow'
              >
                <FaInstagram className='inline' />
              </a>
            </div>
          </div>
        </div>
        <div className='2xl:px-24'>
          <div className='border border-t-0 border-dial-gray-light' />
        </div>
        <div className='px-4 pt-4 pb-8 lg:px-10 2xl:px-24 2xl:pt-8 2xl:pb-12 flex flex-row flex-wrap mx-auto max-w-catalog'>
          <div className='w-full flex flex-row flex-wrap gap-3 leading-none text-base'>
            <div className='py-2 order-last xl:order-first'>
              &copy; {new Date().getFullYear()} {format('footer.organizationName').toUpperCase()}
            </div>
            <div className='py-2 px-3 rounded-md bg-dial-gray-light'>
              <a
                href='https://gitlab.com/dial/osc/eng/t4d-online-catalog/product-registry'
                target='_blank' rel='noreferrer'
                className='border-b-2 border-transparent hover:border-dial-yellow'
              >
                {format('footer.privacyPolicy').toUpperCase()}
              </a>
            </div>
            <div className='py-2 px-3 rounded-md bg-dial-gray-light'>
              <a
                href='https://gitlab.com/dial/osc/eng/t4d-online-catalog/product-registry'
                target='_blank' rel='noreferrer'
                className='border-b-2 border-transparent hover:border-dial-yellow'
              >
                {format('footer.reportIssue').toUpperCase()}
              </a>
            </div>
            <div className='py-2 px-3 rounded-md bg-dial-gray-light'>
              <a
                href='mailto:issues@solutions.dial.community'
                target='_blank' rel='noreferrer'
                className='border-b-2 border-transparent hover:border-dial-yellow'
              >
                {format('footer.contactUs').toUpperCase()}
              </a>
            </div>
            <div className='py-2 px-0 2xl:px-2 flex-auto xl:text-left 2xl:text-right'>
              <span>{format('footer.icons')} </span>
              <a
                className='border-b-2 border-transparent hover:border-dial-yellow'
                href='https://fontawesome.com/' target='_blank' rel='noreferrer'
              >
                FontAwesome
              </a>
              <span> and </span>
              <a
                className='border-b-2 border-transparent hover:border-dial-yellow'
                href='https://www.globalgoals.org/' target='_blank' rel='noreferrer'
              >
                The Global Goals for Sustainable Development
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
