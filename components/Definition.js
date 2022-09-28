import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import dynamic from 'next/dynamic'

const LiteYoutubeEmbed = dynamic(() => import('react-lite-yt-embed').then((module) => module.LiteYoutubeEmbed), { ssr: false })

const Description = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const [openTab, setOpenTab] = useState(0)

  const tabClickHandler = (e, tabNumber) => {
    e.preventDefault()
    setOpenTab(tabNumber)
  }

  const generateAnchorStyles = (tabNumber) => `
    px-5 py-3 rounded-l-lg block leading-loose tracking-wide whitespace-nowrap xl:pr-24
    ${openTab === tabNumber ? 'font-bold text-carousel bg-carousel-light' : 'text-dial-gray-dark bg-white'}
  `

  const sectionList = [
    format('definition.sections.what'), format('definition.sections.who'), format('definition.sections.how'),
    format('definition.sections.approach'), format('definition.sections.featured'), format('definition.sections.contact')
  ]

  return (
    <div className='hidden lg:block'>
      <div className='relative pb-8 lg:pb-12 2xl:max-w-full'>
        <main className='pt-8 mx-auto px-6 sm:px-12 xl:pt-12 xl:max-w-6xl 2xl:max-w-7xl'>
          <div className='text-lg text-dial-blue-darkest md:text-xl xl:text-2xl xl:leading-landing py-8'>
            {format('definition.title')}
          </div>
          <div className='grid grid-cols-3'>
            <ul className='flex flex-col mb-0 list-none'>
              {
                sectionList.map((section, index) => (
                  <li key={`actor-${index}`} className='-mb-px'>
                    <a
                      data-toggle='tab' href={`#${section.replace(/\s+/g, '-').toLowerCase()}`}
                      className={generateAnchorStyles(index)} onClick={e => tabClickHandler(e, index)}
                    >
                      {section}
                    </a>
                  </li>
                ))
              }
            </ul>
            <div className='col-span-2 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded-b bg-gradient-to-r from-carousel-light'>
              <div className='px-4 py-5'>
                <div className='tab-content tab-space'>
                  <div className={openTab === 0 ? 'block' : 'hidden'} id='donors'>
                    <div className='px-8 py-4 xl:max-h-xl'>
                      <LiteYoutubeEmbed
                        id='K-4j3kvT6aE'
                        mute={false}
                        imageAltText='The DIAL Catalog of Digital Solutions: Overview'
                        iframeTitle='The DIAL Catalog of Digital Solutions: Overview'
                      />
                    </div>
                  </div>
                  <div className={openTab === 1 ? 'block' : 'hidden'} id='policy-makers'>
                    <div className='flex flex-col col-span-2 flex-wrap p-8 xl:max-h-lg text-dial-blue-darkest'>
                      <div className='text-lg tracking-wide'>
                        {parse(format('definition.who'))}
                      </div>
                    </div>
                  </div>
                  <div className={openTab === 2 ? 'block' : 'hidden'} id='implementing-partners'>
                    <div className='flex flex-col px-8 xl:max-h-lg text-dial-blue-darkest'>
                      <p className='text-lg tracking-wide pb-3'>
                        {format('definition.how')}
                      </p>
                      <div className='grid grid-cols-3'>
                        <a className='py-3' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191627338/Catalog+Tutorials' target='_blank' rel='noreferrer'>
                          <button
                            className={`
                                    my-auto px-3 py-3 my-3 font-semibold ml-auto
                                    text-white bg-dial-blue rounded
                                  `}
                          >{format('definition.buttons.tutorials')}
                          </button>
                        </a>
                        <div className='py-1 col-span-2'>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191791105/Introduction+to+this+tutorial+series' target='_blank' rel='noreferrer'>{format('definition.tutorial.intro')}</a>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191889422/Tutorial+Getting+Started+with+the+Catalog' target='_blank' rel='noreferrer'>{format('definition.tutorial.started')}</a>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191791118/Tutorial+SDG+Digital+Investment+Framework' target='_blank' rel='noreferrer'>{format('definition.tutorial.framework')}</a>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191791140/Tutorial+How+to+use+the+Products+Tab' target='_blank' rel='noreferrer'>{format('definition.tutorial.products')}</a>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191856647/Tutorial+Using+Filters' target='_blank' rel='noreferrer'>{format('definition.tutorial.filters')}</a>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191889475/Tutorial+Use+Cases+Tab' target='_blank' rel='noreferrer'>{format('definition.tutorial.use-cases')}</a>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191823921/Tutorial+Product+Recommendation+Wizard' target='_blank' rel='noreferrer'>{format('definition.tutorial.wizard')}</a>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191856657/Tutorial+Community' target='_blank' rel='noreferrer'>{format('definition.tutorial.community')}</a>
                          <a className='block px-3 py-1 text-dial-teal' href='https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/191856664/Conclusion+to+the+tutorial+series' target='_blank' rel='noreferrer'>{format('definition.tutorial.conclusion')}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={openTab === 3 ? 'block' : 'hidden'} id='tech-ict-partners'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-lg text-dial-blue-darkest'>
                      <p className='text-lg tracking-wide pb-6'>
                        {parse(format('definition.approach'))}
                      </p>
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
                  <div className={openTab === 4 ? 'block' : 'hidden'} id='procurers'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-lg text-dial-blue-darkest'>
                      <p className='text-lg tracking-wide'>
                        {parse(format('definition.featured'))}
                      </p>
                    </div>
                  </div>
                  <div className={openTab === 5 ? 'block' : 'hidden'} id='product-owners'>
                    <div className='flex flex-col flex-wrap p-8 h-72 text-dial-blue-darkest'>
                      <p className='text-lg tracking-wide pb-6'>
                        {format('definition.contact')}
                      </p>
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
            </div>
          </div>
          <div className='text-lg text-dial-blue-darkest md:text-xl xl:text-2xl xl:leading-landing py-8'>
            <strong>{format('definition.goal')}</strong>
            {format('definition.subtitle')}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Description
