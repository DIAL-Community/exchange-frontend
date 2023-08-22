import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { IoClose } from 'react-icons/io5'
import { DisplayType } from '../utils/constants'

const PlaybookCard = ({ displayType, index, playbook, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {playbook.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 mx-auto bg-white border'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.playbook.label') })}
              className='object-contain w-16 h-16 mx-auto my-2'
            />
          </div>
        }
        {playbook.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20 mx-auto bg-dial-plum rounded-full'>
            <img
              src='/ui/v1/playbook-header.svg'
              alt={format('ui.image.logoAlt', { name: format('ui.playbook.label') })}
              className='object-contain w-12 h-12 mx-auto mt-4 white-filter'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {playbook.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {playbook?.playbookDescription && parse(playbook?.playbookDescription.sanitizedOverview)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-dial-sapphire text-sm font-semibold'>
              {`${playbook.draft}` === 'true' ? format('ui.playbook.status.draft') : format('ui.playbook.status.published')}
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.tag.header')} ({playbook.tags?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-playbook-bg-light to-playbook-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {playbook.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full bg-dial-plum w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.playbook.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {playbook.imageFile.indexOf('placeholder.svg') < 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.playbook.header') })}
            className='object-contain w-10 h-10 my-auto min-w-[2.5rem]'
          />
        }
        <div className='text-sm font-semibold text-dial-meadow my-auto'>
          {playbook.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/playbooks/${playbook.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      {dismissCardHandler && {}.toString.call(dismissCardHandler) === '[object Function]' &&
        <button type='button' className='absolute p-2 top-0 right-0 text-dial-sapphire'>
          <IoClose size='1rem' className='text-dial-plum' onClick={dismissCardHandler} />
        </button>
      }
    </div>
  )
}

export default PlaybookCard
