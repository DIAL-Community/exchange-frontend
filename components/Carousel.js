import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

const buttonAnchorStyle = `
  rounded-full flex items-center justify-center py-2 mt-4 leading-8 lg:py-2
`

const Carousel = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [openTab, setOpenTab] = useState(0)

  const clickHandler = (e, tabNumber) => {
    e.preventDefault()
    if (tabNumber < 0) {
      setOpenTab(4)
    } else if (tabNumber > 4) {
      setOpenTab(0)
    } else {
      setOpenTab(tabNumber)
    }
  }

  useEffect(() => {
    setOpenTab(0)
    const interval = setInterval(changeTab, 5000)
    return () => clearInterval(interval)
  }, [])

  const changeTab = () => {
    setOpenTab(openTab => {
      return openTab === 4 ? 0 : openTab + 1
    })
  }

  return (
    <div className='block lg:hidden mx-auto p-6 sm:p-12 lg:p-48 bg-gray-200'>
      <div className='relative rounded-lg block md:flex items-center bg-gray-100 shadow-xl' style={{ minHeight: '19rem' }}>
        <div className={openTab === 0 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 h-full overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg' style={{ minHeight: '19rem' }}>
            <img className='w-56 h-56 mt-8 md:px-4 md:my-auto mx-auto xl:mt-0' src='images/tiles/sdg.svg' alt='' />
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide'>
                <span className='font-bold'>{format('definition.donors')} </span>
                {format('definition.donor.desc1')}
              </p>
              <p className='text-base tracking-wide pt-4'>
                {format('definition.donor.desc2')}
              </p>
              <a href='sdgs' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-dial-teal`}>
                {format('definition.explore-sdg')}
              </a>
            </div>
          </div>
        </div>
        <div className={openTab === 1 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 h-full overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg' style={{ minHeight: '19rem' }}>
            <img className='w-56 h-56 mt-8 md:px-4 md:my-auto mx-auto xl:mt-0' src='images/tiles/use-case.svg' alt='' />
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide'>
                <span className='font-bold'>{format('definition.policy-makers')} </span>
                {format('definition.policy-maker.desc1')}
              </p>
              <p className='text-base tracking-wide pt-4'>
                {format('definition.policy-maker.desc2')}
              </p>
              <a href='use_cases' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-use-case`}>
                {format('definition.explore-usecase')}
              </a>
            </div>
          </div>
        </div>
        <div className={openTab === 2 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 h-full overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg' style={{ minHeight: '19rem' }}>
            <img className='w-56 h-56 mt-8 md:px-4 md:my-auto mx-auto xl:mt-0' src='images/tiles/workflow.svg' alt='' />
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide'>
                <span className='font-bold'>{format('definition.implementers')} </span>
                {format('definition.implementer.desc1')}
              </p>
              <p className='text-base tracking-wide pt-4'>
                {format('definition.implementer.desc2')}
              </p>
              <a href='workflows' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-workflow`}>
                {format('definition.explore-workflow')}
              </a>
            </div>
          </div>
        </div>
        <div className={openTab === 3 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 h-full overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg' style={{ minHeight: '19rem' }}>
            <img className='w-56 h-56 mt-8 md:px-4 md:my-auto mx-auto xl:mt-0' src='images/tiles/building-block.svg' alt='' />
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide'>
                <span className='font-bold'>{format('definition.ministers')} </span>
                {format('definition.minister.desc1')}
              </p>
              <p className='text-base tracking-wide pt-4'>
                {format('definition.minister.desc2')}
              </p>
              <a href='building_blocks' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-building-block`}>
                {format('definition.explore-bb')}
              </a>
            </div>
          </div>
        </div>
        <div className={openTab === 4 ? 'block md:flex' : 'hidden'}>
          <div className='relative w-full md:w-2/5 h-full overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg' style={{ minHeight: '19rem' }}>
            <img className='w-56 h-56 mt-8 md:px-4 md:my-auto mx-auto xl:mt-0' src='images/tiles/product.svg' alt='' />
          </div>
          <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
            <div className='p-6 md:py-12'>
              <p className='text-lg tracking-wide'>
                <span className='font-bold'>{format('definition.procurers')} </span>
                {format('definition.procurer.desc1')}
              </p>
              <p className='text-base tracking-wide pt-4'>
                {format('definition.procurer.desc2')}
              </p>
              <a href='products' className={`${buttonAnchorStyle} shadow-2xl px-8 text-white bg-product`}>
                {format('definition.explore-prod')}
              </a>
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
