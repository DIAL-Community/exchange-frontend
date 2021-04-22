import Link from 'next/link'
import { useIntl } from 'react-intl'

const Landing = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const buttonAnchorStyle = `
    w-full rounded flex items-center justify-center py-2 leading-8 border border-white
    tracking-wide lg:py-4
  `

  const blurbStyle = `
    mt-4 text-base text-gray-500 sm:mt-5 sm:mx-auto md:mt-8 md:text-2xl lg:mx-0 lg:max-w-lg 
    xl:text-3xl xl:leading-landing
  `

  return (
    <>
      <div className='flex flex-row'>
        <div className='absolute top-0 left-0 w-6/12 h-screen' style={{ backgroundColor: '#F5F6FA' }}>&nbsp;</div>
        <div className='absolute top-0 right-0 w-6/12 h-screen' style={{ backgroundColor: '#646375' }}>&nbsp;</div>
      </div>
      <div className='relative overflow-hidden landing-with-menu'>
        <div className='mx-auto'>
          <div className='relative z-10 pb-8 sm:pb-16 md:pb-20 xl:pb-32 2xl:max-w-7xl'>
            <main className='mt-6 mx-auto px-6 sm:mt-12 sm:px-12 lg:mt-16 lg:px-16 xl:mt-48 xl:max-w-6xl 2xl:max-w-5xl'>
              <div className='text-left lg:max-w-2xl'>
                <div className='text-xl text-gray-900 md:text-2xl xl:text-4xl xl:leading-landing'>
                  {format('landing.subtitle')}
                </div>
                <div className='font-bold  text-gray-900 text-3xl md:text-5xl xl:text-landing-title'>
                  <span className='block'>{format('landing.title.firstLine')}</span>
                  <span className='block'>{format('landing.title.secondLine')}</span>
                </div>
                <p className={blurbStyle}>
                  {format('landing.blurb')}
                </p>
                <div className='mt-8 sm:mt-12 sm:flex lg:justify-start md:text-lg lg:text-2xl'>
                  <div className='text-white lg:py-1'>
                    <a href='products' className={`${buttonAnchorStyle} shadow-2xl px-10 text-white bg-dial-blue`}>
                      {format('landing.catalog.title')}
                    </a>
                  </div>
                  <div className='mt-3 sm:mt-0 sm:ml-3 lg:py-1'>
                    <a href='wizard' className={`${buttonAnchorStyle} shadow-2xl px-8 text-gray-800 bg-dial-yellow`}>
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
