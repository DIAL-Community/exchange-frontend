import Link from 'next/link'
import { useIntl } from 'react-intl'

const Landing = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const buttonAnchorStyle = `
    w-full rounded-full flex items-center justify-center py-2 leading-8 tracking-wide lg:py-2
  `

  const blurbStyle = `
    mt-4 text-base text-dial-blue-darkest sm:mt-5 sm:mx-auto md:mt-8 md:text-lg lg:mx-0 lg:max-w-lg 
    xl:text-xl w-96
  `

  return (
    <>
      <div className='flex flex-row'>
        <div className='absolute top-0 left-0 w-6/12 h-screen' style={{ backgroundColor: '#F5F6FA' }}>&nbsp;</div>
        <div className='absolute top-0 right-0 w-6/12 h-screen' style={{ backgroundColor: '#646375' }}>&nbsp;</div>
      </div>
      <div className='relative overflow-hidden landing-with-menu'>
        <div className='mx-auto'>
          <div className='relative h-full z-10 pb-8'>
            <main className='grid grid-cols-5'>
              <div className='col-span-3 h-screen text-left grid place-content-center'>
                <div className='text-lg text-dial-blue-darkest md:text-xl xl:text-2xl xl:leading-landing'>
                  {format('landing.subtitle')}
                </div>
                <div className='font-bold text-dial-blue-darkest text-2xl md:text-3xl xl:text-4xl'>
                  <span className='block'>{format('landing.title.firstLine')}</span>
                  <span className='block'>{format('landing.title.secondLine')}</span>
                </div>
                <p className={blurbStyle}>
                  {format('landing.blurb')}
                </p>
                <div className='mt-8 sm:mt-12 sm:flex lg:justify-start sm:text-xs md:text-sm lg:text-lg'>
                  <div className='text-white lg:py-1'>
                    <a href='products' className={`${buttonAnchorStyle} shadow-2xl px-10 text-white bg-dial-blue`}>
                      {format('landing.catalog.title')}
                    </a>
                  </div>
                  <div className='mt-3 sm:mt-0 sm:ml-3 lg:py-1'>
                    <a href='wizard' className={`${buttonAnchorStyle} shadow-2xl pl-4 pr-8 text-button-gray bg-dial-yellow`}>
                      <img src='/icons/wizard.svg' className='inline mx-2' alt='Back' height='20px' width='20px' />
                      {format('landing.wizard.title')}
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className='absolute inset-y-0 right-0'>
          <img
            className='h-full object-cover'
            src='images/hero-image/hero-image.png'
            alt='Banner of the catalog of digital solutions.'
          />
        </div>
      </div>
    </>
  )
}

export default Landing
