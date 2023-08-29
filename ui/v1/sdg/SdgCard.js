import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const SdgCard = ({ displayType, index, sdg, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[8rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {sdg.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 mx-auto bg-white border my-auto'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.sdg.label') })}
              className='object-contain w-16 h-16 mx-auto my-2'
            />
          </div>
        }
        {sdg.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20 mx-auto my-auto'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.sdg.label') })}
              className='object-contain w-16 h-16'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {sdg.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {sdg?.longTitle}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdgTarget.header')} ({sdg.sdgTargets?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {sdg.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full bg-dial-plum w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.sdg.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {sdg.imageFile.indexOf('placeholder.svg') < 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.sdg.header') })}
            className='object-contain w-10 h-10 my-auto min-w-[2.5rem]'
          />
        }
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {sdg.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/sdgs/${sdg.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default SdgCard
