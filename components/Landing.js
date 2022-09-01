import Link from 'next/link'
import { useIntl } from 'react-intl'
import Image from 'next/image'

const Landing = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const buttonAnchorStyle = `
    w-full rounded-full flex items-center justify-center py-2 leading-8 tracking-wide lg:py-2
  `

  const blurbStyle = `
    px-4 mt-4 text-base text-dial-blue-darkest sm:mt-5 md:mt-8 md:text-lg lg:mx-0
    xl:text-xl w-96
  `

  return (
    <>
      <div className='flex flex-row'>
        <div className='absolute top-0 left-0 w-9/12 h-screen bg-dial-hero-graphic-light'>&nbsp;</div>
        <div className='absolute top-0 right-0 w-3/12 h-screen bg-dial-hero-graphic-dark'>&nbsp;</div>
      </div>
      <div className='relative overflow-hidden landing-with-menu'>
        <div className='max-w-catalog mx-auto'>
          <div className='relative h-full z-70 pb-8'>
            <div className='grid grid-cols-5'>
              <div className='col-span-5 lg:col-span-3 h-screen text-left lg:grid lg:place-content-center mt-24 lg:mt-0 lg:ml-0'>
                <div>
                  <div className='px-4 text-lg text-dial-blue-darkest md:text-xl xl:text-2xl xl:leading-landing'>
                    {format('landing.subtitle')}
                  </div>
                  <div className='px-4 font-bold text-dial-blue-darkest text-2xl md:text-3xl xl:text-4xl'>
                    <span className='block'>{format('landing.title.firstLine')}</span>
                    <span className='block'>{format('landing.title.secondLine')}</span>
                  </div>
                  <p className={blurbStyle}>
                    {format('landing.blurb')}
                  </p>
                </div>
                <div className='px-4 mt-8 pt-60 lg:pt-0 sm:flex md:justify-start sm:text-xs md:text-sm lg:text-lg'>
                  <div className='text-white lg:py-1'>
                    <Link href='/products'>
                      <a href='/products' className={`${buttonAnchorStyle} shadow-2xl px-10 text-white bg-dial-blue`}>
                        {format('landing.catalog.title')}
                      </a>
                    </Link>
                  </div>
                  <div className='px-4 mt-3 sm:mt-0 sm:ml-3 lg:py-1'>
                    <Link href='/wizard'>
                      <a href='/wizard' className={`${buttonAnchorStyle} shadow-2xl pl-4 pr-8 text-button-gray bg-dial-yellow`}>
                        <img src='/icons/wizard.svg' className='inline mx-2' alt='Back' height='20px' width='20px' />
                        {format('landing.wizard.title')}
                      </a>
                    </Link>
                  </div>
                </div>
                <div className='px-4 mt-3 sm:flex md:justify-start sm:text-xs md:text-sm lg:text-lg'>
                  <div className='text-white lg:py-1'>
                    <Link href='https://digitalimpactalliance.us11.list-manage.com/subscribe?u=38fb36c13a6fa71469439b2ab&id=18657ed3a5'>
                      <a target='_blank' rel='noreferrer' className={`${buttonAnchorStyle} shadow-2xl px-10 text-white bg-sdg-target`}>
                        {format('landing.newsletter')}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Image
            layout='fill'
            objectFit='contain'
            className='h-screen object-cover'
            src='/images/hero-image/hero-image.png'
            alt='Banner of the catalog of digital solutions.'
            priority
          />
        </div>
      </div>
    </>
  )
}

export default Landing
