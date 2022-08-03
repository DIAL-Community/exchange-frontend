import { useState } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'

const Carousel = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)
  const [openTab, setOpenTab] = useState(0)

  const clickHandler = (e, tabNumber) => {
    e.preventDefault()
    if (tabNumber < 0) {
      setOpenTab(5)
    } else if (tabNumber > 5) {
      setOpenTab(0)
    } else {
      setOpenTab(tabNumber)
    }
  }

  return (
    <div className='block lg:hidden mx-auto p-6 sm:p-12 lg:p-48 bg-gray-200'>
      <div className='relative rounded-lg block md:flex items-center bg-gray-100 shadow-xl' style={{ minHeight: '19rem' }}>
        <div className={openTab === 0 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 px-5 py-3 rounded-l-lg block text-center leading-loose tracking-wide whitespace-nowrap font-bold text-lg text-carousel bg-carousel-light'>
            {format('definition.sections.what')}
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12' style={{ zIndex: 20 }}>
              <iframe loading='lazy' title='The DIAL Catalog of Digital Solutions: Overview' src='https://www.youtube.com/embed/K-4j3kvT6aE' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen='' />
            </div>
          </div>
        </div>
        <div className={openTab === 1 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 px-5 py-3 rounded-l-lg block text-center leading-loose tracking-wide whitespace-nowrap font-bold text-lg text-carousel bg-carousel-light'>
            {format('definition.sections.who')}
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <div className='text-lg tracking-wide'>
                {parse(format('definition.who'))}
              </div>
            </div>
          </div>
        </div>
        <div className={openTab === 2 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 px-5 py-3 rounded-l-lg block text-center leading-loose tracking-wide whitespace-nowrap font-bold text-lg text-carousel bg-carousel-light'>
            {format('definition.sections.how')}
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide pb-3'>
                {format('definition.how')}
              </p>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191791105/Introduction+to+this+tutorial+series' target='_blank' rel='noreferrer'>{format('definition.tutorial.intro')}</a>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191889422/Tutorial+Getting+Started+with+the+Catalog' target='_blank' rel='noreferrer'>{format('definition.tutorial.started')}</a>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191791118/Tutorial+SDG+Digital+Investment+Framework' target='_blank' rel='noreferrer'>{format('definition.tutorial.framework')}</a>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191791140/Tutorial+How+to+use+the+Products+Tab' target='_blank' rel='noreferrer'>{format('definition.tutorial.products')}</a>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191856647/Tutorial+Using+Filters' target='_blank' rel='noreferrer'>{format('definition.tutorial.filters')}</a>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191889475/Tutorial+Use+Cases+Tab' target='_blank' rel='noreferrer'>{format('definition.tutorial.use-cases')}</a>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191823921/Tutorial+Product+Recommendation+Wizard' target='_blank' rel='noreferrer'>{format('definition.tutorial.wizard')}</a>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191856657/Tutorial+Community' target='_blank' rel='noreferrer'>{format('definition.tutorial.community')}</a>
              <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191856664/Conclusion+to+the+tutorial+series' target='_blank' rel='noreferrer'>{format('definition.tutorial.conclusion')}</a>
              <div className='pt-3 text-center'>
                <a className='py-3' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191627338/Catalog+Tutorials' target='_blank' rel='noreferrer'>
                  <button
                    className={`
                            my-auto px-3 py-3 my-3 font-semibold ml-auto
                            text-white bg-dial-blue rounded
                          `}
                  >{format('definition.buttons.tutorials')}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={openTab === 3 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 px-5 py-3 rounded-l-lg block text-center leading-loose tracking-wide whitespace-nowrap font-bold text-lg text-carousel bg-carousel-light'>
            {format('definition.sections.approach')}
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide pb-6'>
                {parse(format('definition.approach'))}
              </p>
              <div className='text-center'>
                <a href='https://digitalimpactalliance.org/research/sdg-digital-investment-framework/' target='_blank' rel='noreferrer'>
                  <button
                    className={`
                            my-auto px-3 py-3 my-3 font-semibold ml-auto
                            text-white bg-dial-blue rounded
                          `}
                  >{format('definition.buttons.learn')}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={openTab === 4 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 px-5 py-3 rounded-l-lg block text-center leading-loose tracking-wide whitespace-nowrap font-bold text-lg text-carousel bg-carousel-light'>
            {format('definition.sections.featured')}
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide'>
                {parse(format('definition.featured'))}
              </p>
            </div>
          </div>
        </div>
        <div className={openTab === 5 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 px-5 py-3 rounded-l-lg block text-center leading-loose tracking-wide whitespace-nowrap font-bold text-lg text-carousel bg-carousel-light'>
            {format('definition.sections.contact')}
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide pb-6'>
                {format('definition.contact')}
              </p>
              <div className='text-center'>
                <a href='mailto:issues@solutions.dial.community' target='_blank' rel='noreferrer'>
                  <button
                    className={`
                            my-auto px-3 py-4 my-3 font-semibold ml-auto
                            text-white bg-dial-blue rounded
                          `}
                  >
                    {format('definition.buttons.contact')}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => clickHandler(e, openTab - 1)}
          className={`
            absolute top-0 mt-32 left-0 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-blue-400
            hover:text-blue-500 focus:text-blue-600 -ml-6 focus:outline-none focus:shadow-outline
          `}
        >
          <span className='block' style={{ transform: 'scale(-1)' }}>&#x279c;</span>
        </button>
        <button
          onClick={(e) => clickHandler(e, openTab + 1)}
          className={`
            absolute top-0 mt-32 right-0 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-blue-400
            hover:text-blue-500 focus:text-blue-600 -mr-6 focus:outline-none focus:shadow-outline
          `}
        >
          <span className='block' style={{ transform: 'scale(1)' }}>&#x279c;</span>
        </button>
      </div>
    </div>
  )
}

export default Carousel
