import { useCallback } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const OpportunityCard = ({ displayType, index, opportunity, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {opportunity.imageFile.indexOf('placeholder.png') < 0 &&
          <div className='w-20 h-20 mx-auto bg-white border'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + opportunity.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.opportunity.label') })}
              className='object-contain w-16 h-16 mx-auto my-2'
            />
          </div>
        }
        {opportunity.imageFile.indexOf('placeholder.png') >= 0 &&
          <div className='w-20 h-20 mx-auto bg-dial-plum rounded-full'>
            <img
              src='/ui/v1/opportunity-header.svg'
              alt={format('ui.image.logoAlt', { name: format('ui.opportunity.label') })}
              className='object-contain w-8 h-8 mx-auto mt-6 white-filter'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {opportunity.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {opportunity?.parsedDescription && parse(opportunity?.parsedDescription)}
          </div>
          <div className='flex flex-row gap-x-3'>
            <div className='flex flex-row gap-x-2'>
              <div className='text-sm text-dial-stratos'>
                {format('ui.opportunity.opportunityStatus')}:
              </div>
              <div className='text-sm text-dial-stratos'>
                {opportunity.opportunityStatus ?? format('general.unknown')}
              </div>
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='flex flex-row gap-x-2'>
              <div className='text-sm text-dial-stratos'>
                {format('ui.opportunity.closingDate')}:
              </div>
              <div className='text-sm text-dial-stratos'>
                {!opportunity.closingDate && format('general.unknown')}
                {opportunity.closingDate && <FormattedDate value={opportunity.closingDate} />}
              </div>
            </div>
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sector.header')} ({opportunity.sectors?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.organization.header')} ({opportunity.organizations?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.country.header')} ({opportunity.countries?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-opportunity-bg-light to-opportunity-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {opportunity.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full bg-dial-plum w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + opportunity.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.opportunity.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {opportunity.imageFile.indexOf('placeholder.svg') < 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + opportunity.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.opportunity.header') })}
            className='object-contain w-10 h-10 my-auto min-w-[2.5rem]'
          />
        }
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {opportunity.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/opportunities/${opportunity.slug}`}>
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

export default OpportunityCard
