import { useIntl } from 'react-intl'

const Carousel = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className='block lg:hidden mx-auto p-6 sm:p-12 lg:p-48 bg-gray-200'>
      <div className='relative rounded-lg block md:flex items-center bg-gray-100 shadow-xl' style={{ minHeight: '19rem' }}>
        <div className='relative w-full md:w-2/5 h-full overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg' style={{ minHeight: '19rem' }}>
          <img className='absolute inset-0 w-full h-full object-cover object-center' src='images/hero-banner.png' alt='' />
          <div className='absolute inset-0 w-full h-full bg-indigo-900 opacity-75' />
        </div>
        <div className='w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg'>
          <div className='p-12 md:pr-24 md:pl-16 md:py-12'>
            <p className='text-gray-600'>
              <span className='text-gray-900'>Bacon </span>
              ipsum dolor amet ham t-bone bresaola pig tongue short ribs tri-tip landjaeger. Cow drumstick
              beef, short ribs chicken pastrami alcatra t-bone. Leberkas fatback rump pastrami tail, jowl t-bone
              meatloaf turkey prosciutto kevin chislic ribeye sausage. Picanha venison fatback frankfurter
              shoulder strip steak tongue boudin andouille. Flank sirloin tongue doner turducken, shank andouille
              salami filet mignon. Ball tip jowl corned beef andouille pork.
            </p>
            <a className='flex items-baseline mt-3 text-indigo-600 hover:text-indigo-900 focus:text-indigo-900' href=''>
              <span>Learn more about our users</span>
              <span className='text-xs ml-1'>&#x279c;</span>
            </a>
          </div>
          <svg className='hidden md:block absolute inset-y-0 h-full w-24 fill-current text-gray-100 -ml-12' viewBox='0 0 100 100' preserveAspectRatio='none'>
            <polygon points='50,0 100,0 50,100 0,100' />
          </svg>
        </div>
        <button className='absolute top-0 mt-32 left-0 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-indigo-600 hover:text-indigo-400 focus:text-indigo-400 -ml-6 focus:outline-none focus:shadow-outline'>
          <span className='block' style={{ transform: 'scale(-1)' }}>&#x279c;</span>
        </button>
        <button className='absolute top-0 mt-32 right-0 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-indigo-600 hover:text-indigo-400 focus:text-indigo-400 -mr-6 focus:outline-none focus:shadow-outline'>
          <span className='block' style={{ transform: 'scale(1)' }}>&#x279c;</span>
        </button>
      </div>
    </div>
  )
}

export default Carousel
