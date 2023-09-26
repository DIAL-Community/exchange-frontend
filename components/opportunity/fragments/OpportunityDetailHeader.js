import { useCallback } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { prependUrlWithProtocol } from '../../utils/utilities'
import OpportunityDetailSectors from './OpportunityDetailSectors'

const OpportunityDetailHeader = ({ opportunity }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
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
              className='object-contain dial-plum-filter'
            />
          </div>
        }
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.opportunity.webAddress')}
          </div>
          <div className='flex text-dial-stratos'>
            <a
              href={prependUrlWithProtocol(opportunity.webAddress)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1'>
                {opportunity.webAddress}
              </div>
            </a>
            &nbsp;⧉
          </div>
        </div>
        <OpportunityDetailSectors opportunity={opportunity} canEdit={canEdit} />
        <div className='flex flex-row gap-x-3'>
          <div className='flex flex-col gap-y-3 w-full'>
            <div className='font-semibold text-dial-sapphire'>
              {format('ui.opportunity.opportunityStatus')}
            </div>
            <div className='flex flex-col gap-y-2 text-dial-stratos'>
              {opportunity.opportunityStatus ?? format('general.unknown')}
            </div>
          </div>
          <div className='flex flex-col gap-y-3 w-full'>
            <div className='font-semibold text-dial-sapphire'>
              {format('ui.opportunity.closingDate')}
            </div>
            <div className='flex flex-col gap-y-2 text-dial-stratos'>
              {!opportunity.closingDate && format('general.na')}
              {opportunity.closingDate && <FormattedDate value={opportunity.closingDate} />}
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.opportunity.opportunityType')}
          </div>
          <div className='flex flex-col gap-y-2 text-dial-stratos'>
            {opportunity.opportunityType ?? format('general.unknown')}
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.opportunity.origin')}
          </div>
          <div className='flex flex-col gap-y-2 text-dial-stratos'>
            {opportunity.origin.name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpportunityDetailHeader
