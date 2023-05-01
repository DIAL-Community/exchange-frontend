import Image from 'next/image'
import { useCallback } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlViewer } from '../shared/HtmlViewer'
import CommentsSection from '../shared/comment/CommentsSection'
import { ObjectType } from '../../lib/constants'
import { prependUrlWithProtocol } from '../../lib/utilities'
import { useUser } from '../../lib/hooks'
import OpportunityDetailCountries from './OpportunityDetailCountries'
import OpportunityDetailSectors from './OpportunityDetailSectors'
import OpportunityDetailOrganizations from './OpportunityDetailOrganizations'
import OpportunityDetailUseCases from './OpportunityDetailUseCases'
import OpportunityDetailBuildingBlocks from './OpportunityDetailBuildingBlocks'

const sectionHeaderStyle = 'card-title mb-3 text-dial-sapphire'

const OpportunityDetailRight = ({ opportunity, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser } = useUser()

  const canEdit = isAdminUser

  const slugNameMapping = (() => {
    const map = {}
    map[opportunity.slug] = opportunity.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col lg:flex-row flex-wrap'>
        <div className='flex flex-col flex-grow pb-4'>
          <div className={sectionHeaderStyle}>
            {format('opportunity.opportunityType')}
          </div>
          <div className='text-dial-stratos flex'>
            <div className='my-auto'>{opportunity.opportunityType}</div>
          </div>
        </div>
        <div className='flex flex-col flex-grow pb-4'>
          <div className={sectionHeaderStyle}>
            {format('opportunity.openingDate')}
          </div>
          <div className='text-dial-stratos flex'>
            <div className='my-auto'>
              { opportunity.openingDate
                ?<FormattedDate
                  value={new Date(opportunity.openingDate)}
                  year='numeric'
                  month='long'
                  day='2-digit'
                />
                : format('general.na')
              }
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-grow pb-4'>
          <div className={sectionHeaderStyle}>
            {format('opportunity.closingDate')}
          </div>
          <div className='text-dial-stratos flex'>
            <div className='my-auto'>
              { opportunity.closingDate
                ? <FormattedDate
                  value={new Date(opportunity.closingDate)}
                  year='numeric'
                  month='long'
                  day='2-digit'
                />
                : format('general.na')
              }
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col flex-grow pb-4'>
        <div className={sectionHeaderStyle}>
          {format('opportunity.webAddress')}
        </div>
        <div className='flex'>
          { opportunity.webAddress && opportunity.webAddress !== 'N/A'
            ? <a
              href={prependUrlWithProtocol(opportunity.webAddress)}
              className='text-dial-teal border-b-2 border-transparent hover:border-dial-sunshine'
              target='_blank'
              rel='noreferrer'
            >
              <div className='my-auto'>{opportunity.webAddress} ⧉</div>
            </a>
            : format('general.na')
          }
        </div>
      </div>
      {(opportunity.contactName || opportunity.contactEmail) &&
        <div className='flex flex-col'>
          <div className='flex flex-col flex-grow pb-4'>
            <div className={sectionHeaderStyle}>
              {format('opportunity.contact')}
            </div>
            <div className='text-dial-stratos flex mb-1'>
              <div className='my-auto'>{opportunity.contactName}</div>
            </div>
            <div className='text-dial-stratos flex'>
              <div className='my-auto'>{opportunity.contactEmail}</div>
            </div>
          </div>
        </div>
      }
      <div className={`mt-8 ${sectionHeaderStyle}`}>
        {format('product.description')}
      </div>
      <HtmlViewer
        initialContent={opportunity?.description}
        className='-mb-12'
      />
      <OpportunityDetailBuildingBlocks opportunity={opportunity} canEdit={canEdit} />
      <OpportunityDetailCountries opportunity={opportunity} canEdit={canEdit} />
      <OpportunityDetailOrganizations opportunity={opportunity} canEdit={canEdit} />
      <OpportunityDetailSectors opportunity={opportunity} canEdit={canEdit} />
      <OpportunityDetailUseCases opportunity={opportunity} canEdit={canEdit} />
      <div className={`mt-8 ${sectionHeaderStyle}`}>
        {format('opportunity.source')}
      </div>
      <div className='flex flex-col gap-3'>
        {opportunity.origin &&
          <div className='image-block-hack w-24 h-6 relative'>
            <Image
              layout='fill'
              objectFit='scale-down'
              src={'/images/origins/' + opportunity.origin.slug + '.png'}
              alt={format('image.alt.logoFor', { name: opportunity.origin.name })}
            />
          </div>
        }
      </div>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={opportunity.id}
        objectType={ObjectType.OPPORTUNITY}
      />
    </div>
  )
}

export default OpportunityDetailRight
