import Link from 'next/link'
import { FaCircleChevronRight } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'

const DpiLinks = () => {
  return (
    <div className='px-4 lg:px-8 xl:px-56 py-12'>
      <div className='flex gap-12 font-light'>
        <div className='basis-1/2 bg-dial-sapphire text-white'>
          <Link href='/dpi-topics'>
            <div className='flex gap-1'>
              <div className='pl-8 pr-4 py-6 text-xl'>
                <FormattedMessage
                  id='dpi.landing.browseTopics'
                  values={{
                    break: () => <br />
                  }}
                />
              </div>
              <FaCircleChevronRight size='2rem' className='my-auto' />
            </div>
          </Link>
        </div>
        <div className='basis-1/2 bg-dial-sapphire text-white'>
          <Link href='/dpi-countries'>
            <div className='flex gap-1'>
              <div className='pl-8 pr-4 py-6 text-xl'>
                <FormattedMessage
                  id='dpi.landing.featuredCountries'
                  values={{
                    break: () => <br />
                  }}
                />
              </div>
              <FaCircleChevronRight size='2rem' className='my-auto' />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DpiLinks
