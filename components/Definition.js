import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'

const Description = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [openTab, setOpenTab] = useState(0)

  const tabClickHandler = (e, tabNumber) => {
    e.preventDefault()
    setOpenTab(tabNumber)
  }

  useEffect(() => {
    setOpenTab(0);
    const interval = setInterval(changeTab, 5000);
    return () => clearInterval(interval);
  }, []);

  const changeTab = () => {
    setOpenTab(openTab => {
      return openTab === 4 ? 0 : openTab + 1;
    });
  };

  const generateAnchorStyles = (tabNumber) => `
    px-5 py-3 rounded-l-lg block leading-loose tracking-wide whitespace-nowrap xl:pr-24
    ${openTab === tabNumber ? 'font-bold text-carousel bg-carousel-light' : 'text-dial-gray-dark bg-white'}
  `
  const buttonAnchorStyle = `
    rounded-full flex items-center justify-center py-2 leading-8 lg:py-2
  `

  const actorList = [
    format('definition.donors'), format('definition.policy-makers'), format('definition.implementers'), 
    format('definition.ministers'), format('definition.procurers')
  ]

  return (
    <div className='hidden lg:block'>
      <div className='relative pb-8 lg:pb-12 2xl:max-w-full'>
        <main className='pt-8 mx-auto px-6 sm:px-12 xl:pt-12 xl:max-w-6xl 2xl:max-w-7xl'>
          <div className='text-lg text-dial-blue-darkest md:text-xl xl:text-2xl xl:leading-landing py-8'>
            {format('definition.title')}
          </div>
          <div className='grid grid-cols-3'>
            <ul className='flex flex-col mb-0 list-none' role='tablist'>
              {
                actorList.map((actor, index) => (
                  <li key={`actor-${index}`} className='-mb-px'>
                    <a
                      data-toggle='tab' href={`#${actor.replace(/\s+/g, '-').toLowerCase()}`} role='tablist'
                      className={generateAnchorStyles(index)} onClick={e => tabClickHandler(e, index)}
                    >
                      {actor}
                    </a>
                  </li>
                ))
              }
            </ul>
            <div className='col-span-2 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded-b bg-gradient-to-r from-carousel-light'>
              <div className='px-4 py-5'>
                <div className='tab-content tab-space'>
                  <div className={openTab === 0 ? 'block' : 'hidden'} id='donors'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-96 text-dial-blue-darkest'>
                      <p className='text-lg max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>{format('definition.donors')} </span>
                        {format('definition.donor.desc1')}
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        {format('definition.donor.desc2')}
                      </p>
                      <img className='w-56 h-56 mt-8 mx-auto xl:mt-0' src='images/tiles/sdg.svg' alt='' />
                      <a href='sdgs' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-dial-teal`}>
                        {format('definition.explore-sdg')}
                      </a>
                    </div>
                  </div>
                  <div className={openTab === 1 ? 'block' : 'hidden'} id='policy-makers'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-96 text-dial-blue-darkest'>
                      <p className='text-lg max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>{format('definition.policy-makers')} </span>
                        {format('definition.policy-maker.desc1')}
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        {format('definition.policy-maker.desc2')}
                      </p>
                      <img className='w-56 h-56 mt-8 mx-auto xl:mt-0' src='images/tiles/use-case.svg' alt='' />
                      <a href='use_cases' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-use-case`}>
                        {format('definition.explore-usecase')}
                      </a>
                    </div>
                  </div>
                  <div className={openTab === 2 ? 'block' : 'hidden'} id='implementing-partners'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-96 text-dial-blue-darkest'>
                      <p className='text-lg max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>{format('definition.implementers')} </span>
                        {format('definition.implementer.desc1')}
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        {format('definition.implementer.desc2')}
                      </p>
                      <img className='w-56 h-56 mt-8 mx-auto xl:mt-0' src='images/tiles/workflow.svg' alt='' />
                      <a href='workflows' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-workflow`}>
                        {format('definition.explore-workflow')}
                      </a>
                    </div>
                  </div>
                  <div className={openTab === 3 ? 'block' : 'hidden'} id='tech-ict-partners'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-96 text-dial-blue-darkest'>
                      <p className='text-xl max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>{format('definition.ministers')} </span>
                        {format('definition.minister.desc1')}
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        {format('definition.minister.desc2')}
                      </p>
                      <img className='w-56 h-56 mt-8 mx-auto xl:mt-0' src='images/tiles/building-block.svg' alt='' />
                      <a href='building_blocks' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-building-block`}>
                        {format('definition.explore-bb')}
                      </a>
                    </div>
                  </div>
                  <div className={openTab === 4 ? 'block' : 'hidden'} id='procurers'>
                    <div className='flex flex-col flex-wrap p-8 xl:max-h-96 text-dial-blue-darkest'>
                      <p className='text-xl max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>{format('definition.procurers')} </span>
                        {format('definition.procurer.desc1')}
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        {format('definition.procurer.desc2')}
                      </p>
                      <img className='w-56 h-56 mt-8 mx-auto xl:mt-0' src='images/tiles/product.svg' alt='' />
                      <a href='products' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-product`}>
                        {format('definition.explore-prod')}
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
