import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import dynamic from 'next/dynamic'
import classNames from 'classnames'

const LiteYoutubeEmbed = dynamic(
  () => import('react-lite-yt-embed').then((module) => module.LiteYoutubeEmbed),
  { ssr: false }
)

const Description = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const [openTab, setOpenTab] = useState(0)

  const tabClickHandler = (e, tabNumber) => {
    e.preventDefault()
    setOpenTab(tabNumber)
  }

  const generateAnchorStyles = (tabNumber) => classNames(
    'px-5 py-3 rounded-l-lg block leading-loose tracking-wide whitespace-nowrap xl:pr-24',
    openTab === tabNumber
      ? 'font-semibold bg-dial-angel'
      : 'bg-white'
  )

  const sectionList = [
    format('definition.sections.what'),
    format('definition.sections.who'),
    format('definition.sections.how'),
    format('definition.sections.approach'),
    format('definition.sections.featured'),
    format('definition.sections.contact')
  ]

  return (
    <div className='hidden lg:block text-dial-stratos '>
      <div className='relative pb-8 lg:pb-12 2xl:max-w-full'>
        <main className='pt-8 mx-auto px-6 sm:px-12 xl:pt-12 xl:max-w-6xl 2xl:max-w-7xl'>
          <div className='text-lg md:text-xl xl:text-2xl xl:leading-landing py-8'>
            {format('definition.title')}
          </div>
          <div className='grid grid-cols-3'>
            <ul className='flex flex-col mb-0 list-none'>
              {
                sectionList.map((section, index) => (
                  <li key={`actor-${index}`} className='-mb-px'>
                    <a
                      data-toggle='tab'
                      href={`#${section.replace(/\s+/g, '-').toLowerCase()}`}
                      className={generateAnchorStyles(index)}
                      onClick={e => tabClickHandler(e, index)}
                    >
                      {section}
                    </a>
                  </li>
                ))
              }
            </ul>
            <div
              className={classNames(
                'col-span-2 flex flex-col break-words bg-white w-full',
                'rounded-b bg-gradient-to-r from-dial-angel'
              )}
            >
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
                    <div className='flex flex-col col-span-2 flex-wrap p-8 xl:max-h-lg'>
                      <div className='text-lg tracking-wide'>
                        {parse(format('definition.who'))}
                      </div>
                    </div>
                  </div>
                  <div className={openTab === 2 ? 'block' : 'hidden'} id='implementing-partners'>
                    <div className='flex flex-col px-8 xl:max-h-lg'>
                      <p className='text-lg tracking-wide pb-3'>
                        {format('definition.how')}
                      </p>
                      <div className='grid grid-cols-3'>
                        <a
                          className='py-3'
                          href='https://digital-impact-exchange.atlassian.net/l/cp/czeCMrc1'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <button
                            className={classNames(
                              'my-auto px-3 py-3 my-3 font-semibold ml-auto',
                              'text-white bg-dial-sapphire rounded'
                            )}
                          >
                            {format('definition.buttons.tutorials')}
                          </button>
                        </a>
                        <div className='py-1 col-span-2'>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/DGrrxAnW'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {format('definition.tutorial.intro')}
                          </a>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/P53p9r7G'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {format('definition.tutorial.started')}
                          </a>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/CFvP6bww'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {format('definition.tutorial.framework')}
                          </a>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/k4jKPf9A'
                            target='_blank' rel='noreferrer'
                          >
                            {format('definition.tutorial.products')}
                          </a>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/z7NDG7BS'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {format('definition.tutorial.filters')}
                          </a>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/ZRURfBN4'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {format('definition.tutorial.use-cases')}
                          </a>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/wosCpaFc'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {format('definition.tutorial.wizard')}
                          </a>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/tMS1kGMs'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {format('definition.tutorial.community')}
                          </a>
                          <a
                            className='block px-3 py-1 text-dial-iris-blue'
                            href='https://digital-impact-exchange.atlassian.net/l/cp/yfSzEQHT'
                            target='_blank'
                            rel='noreferrer'
                          >
                            {format('definition.tutorial.conclusion')}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={openTab === 3 ? 'block' : 'hidden'} id='tech-ict-partners'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-lg'>
                      <p className='text-lg tracking-wide pb-6'>
                        {parse(format('definition.approach'))}
                      </p>
                      <a
                        href='https://dial.global/research/sdg-digital-investment-framework/'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <button
                          className={`
                            my-auto px-3 py-3 my-3 font-semibold ml-auto
                            text-white bg-dial-sapphire rounded
                          `}
                        >
                          {format('definition.buttons.learn')}
                        </button>
                      </a>
                    </div>
                  </div>
                  <div className={openTab === 4 ? 'block' : 'hidden'} id='procurers'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-lg'>
                      <p className='text-lg tracking-wide'>
                        {parse(format('definition.featured'))}
                      </p>
                    </div>
                  </div>
                  <div className={openTab === 5 ? 'block' : 'hidden'} id='product-owners'>
                    <div className='flex flex-col flex-wrap p-8 h-80'>
                      <p className='text-lg tracking-wide pb-6'>
                        {format('definition.contact')}
                      </p>
                      <a href='mailto:issues@exchange.dial.global' target='_blank' rel='noreferrer'>
                        <button
                          className={classNames(
                            'my-auto px-3 py-4 my-3 font-semibold ml-auto',
                            'text-white bg-dial-sapphire rounded'
                          )}
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
          <div className='text-lg md:text-xl xl:text-2xl xl:leading-landing py-8'>
            <strong>{format('definition.goal')}</strong>
            {format('definition.subtitle')}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Description
