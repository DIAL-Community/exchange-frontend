import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../utils/utilities'

const OpportunityDetailHeader = ({ opportunity }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-meadow font-semibold'>
        {opportunity.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {opportunity.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='inline'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + opportunity.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.opportunity.label') })}
              className='object-contain w-20 h-20'
            />
          </div>
        }
        {opportunity.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + opportunity.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.opportunity.label') })}
              className='object-contain dial-meadow-filter'
            />
          </div>
        }
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('opportunity.webAddress')}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <a
              href={prependUrlWithProtocol(opportunity.webAddress)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1'>
                {opportunity.webAddress}
              </div>
            </a>
            ⧉
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.sector.header')}
          </div>
          <div className='flex flex-col gap-y-2 text-dial-stratos'>
            {opportunity.sectors.length === 0 && format('general.na')}
            {opportunity.sectors.map((sector, index) => {
              return <div key={index}>{sector.name}</div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpportunityDetailHeader
