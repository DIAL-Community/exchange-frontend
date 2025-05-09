import { useCallback } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const OrganizationCard = ({ displayType, index, organization, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row items-center justify-center gap-x-6 gap-y-3'>
        {organization.imageFile.indexOf('placeholder.png') < 0 &&
            <div className='w-20 h-20 mx-auto bg-white border'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className='object-contain w-16 h-16 mx-auto my-2'
              />
            </div>
        }
        {organization.imageFile.indexOf('placeholder.png') >= 0 &&
          <div className='w-20 h-20 mx-auto bg-dial-plum rounded-full'>
            <img
              src='/ui/v1/organization-header.svg'
              alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
              className='object-contain w-12 h-12 mx-auto mt-4 white-filter'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12 h-full'>
          <div className='text-lg font-semibold text-dial-plum'>
            {organization.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {organization?.parsedDescription && parse(organization?.parsedDescription)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sector.header')} ({organization.sectors?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.country.header')} ({organization.countries?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.project.header')} ({organization.projects?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full bg-dial-plum w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.organization.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {organization.imageFile.indexOf('placeholder.svg') < 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.organization.header') })}
            className='object-contain w-10 h-10 my-auto min-w-[2.5rem]'
          />
        }
        <div className='text-sm font-semibold text-dial-plum my-auto line-clamp-2'>
          {organization.name}
        </div>
      </div>
    </div>

  const displayGridCard = () => (
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg'>
      <div className='bg-white border shadow-lg rounded-xl h-[22rem]'>
        <div className="flex flex-col h-full">
          <div
            className={
              classNames(
                'flex justify-center items-center bg-white',
                'rounded-xl border-4 border-dial-warm-beech',
                'py-12 mx-4 my-4 max-h-[10rem]'
              )}
          >
            {organization.imageFile.indexOf('placeholder.svg') < 0 &&
              <div className="inline my-4 mx-6">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain max-h-[5rem] w-[5rem]"
                />
              </div>
            }
            {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
              <div className="w-20 h-20">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain"
                />
              </div>
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold line-clamp-1">
            {organization.name}
          </div>
          <div className="px-6 py-2 text-xs text-dial-stratos font-medium">
            <span className="text-center line-clamp-3">
              {organization.parsedDescription && parse(organization.parsedDescription)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='relative'>
      <Link href={`/organizations/${organization.slug}`}>
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
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

export default OrganizationCard
