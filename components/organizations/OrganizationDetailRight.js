import { FormattedDate, useIntl } from 'react-intl'
import { useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlViewer } from '../shared/HtmlViewer'
import CommentsSection from '../shared/comment/CommentsSection'
import { ObjectType } from '../../lib/constants'
import { prependUrlWithProtocol } from '../../lib/utilities'
import { useOrganizationOwnerUser, useUser } from '../../lib/hooks'
import AggregatorCapability from './AggregatorCapability'
import OrganizationDetailCountries from './OrganizationDetailCountries'
import OrganizationDetailSectors from './OrganizationDetailSectors'
import OrganizationDetailProjects from './OrganizationDetailProjects'
import OrganizationDetailContacts from './OrganizationDetailContacts'
import OrganizationDetailProducts from './OrganizationDetailProducts'
import OrganizationDetailOffices from './OrganizationDetailOffices'

const sectionHeaderStyle = 'card-title mb-3 text-dial-gray-dark'

const DynamicOfficeMarker = (props) => {
  const OfficeMarker = useMemo(() => dynamic(
    () => import('../shared/MapMarker'),
    {
      loading: () => <div>Loading Map data ...</div>,
      ssr: false
    }
  ), [])

  return <OfficeMarker {...props} />
}

const OrganizationDetailRight = ({ organization, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(organization)

  const canEdit = isAdminUser || isOrganizationOwner

  const isEndorser = organization?.whenEndorsed

  const marker = organization.offices.length > 0
    ? {
      position: [parseFloat(organization.offices[0].latitude), parseFloat(organization.offices[0].longitude)],
      title: organization.name,
      body: organization.offices[0].name,
      markerImage: '/icons/digiprins/digiprins.png',
      markerImageAltText: formatMessage({ id: 'image.alt.logoFor' }, { name: format('digitalPrinciple.title') }),
      isEndorser
    }
    : undefined

  const slugNameMapping = (() => {
    const map = {}
    map[organization.slug] = organization.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col lg:flex-row flex-wrap'>
        <div className='flex flex-col flex-grow pb-4'>
          <div className='text-sm text-dial-purple-light leading-6 tracking-wide'>
            {format('organization.detail.website').toUpperCase()}
          </div>
          <div className='text-base text-dial-teal flex' data-testid='organization-website'>
            <a
              href={prependUrlWithProtocol(organization.website)}
              className='border-b-2 border-transparent hover:border-dial-sunshine'
              target='_blank'
              rel='noreferrer'
            >
              <div className='my-auto'>{organization.website} ⧉</div>
            </a>
          </div>
          {
            organization.whenEndorsed &&
              <>
                <div className='text-sm leading-6 text-dial-purple-light pt-6 leading-6 tracking-wide'>
                  {format('organization.detail.whenEndorsed').toUpperCase()}
                </div>
                <div className='text-base text-dial-teal pb-2'>
                  <FormattedDate value={new Date(organization.whenEndorsed)} year='numeric' month='long' day='2-digit' />
                </div>
              </>
          }
          {
            organization.endorserLevel && organization.endorserLevel !== 'none' &&
              <>
                <div className='text-sm leading-6 text-dial-purple-light pt-6 leading-6 tracking-wide'>
                  {format('organization.detail.endorserLevel').toUpperCase()}
                </div>
                <div className='text-base text-dial-sunshine pb-2' data-testid='organization-endorser-level'>
                  {organization.endorserLevel.toUpperCase()}
                </div>
              </>
          }
        </div>
        {
          marker &&
            <DynamicOfficeMarker {...marker} />
        }
      </div>
      <div className={`mt-8 ${sectionHeaderStyle}`}>{format('product.description')}</div>
      <HtmlViewer
        initialContent={organization?.organizationDescription?.description}
        className='-mb-12'
      />
      {canEdit && <OrganizationDetailOffices organization={organization} canEdit={canEdit} />}
      {canEdit && <OrganizationDetailContacts organization={organization}/>}
      {organization.sectors && <OrganizationDetailSectors organization={organization} canEdit={canEdit} />}
      {organization.countries && <OrganizationDetailCountries organization={organization} canEdit={canEdit} />}
      {organization.products && <OrganizationDetailProducts organization={organization} canEdit={canEdit} />}
      {organization.projects && <OrganizationDetailProjects organization={organization} canEdit={canEdit} />}
      {
        organization.isMni &&
          <div className='mt-12'>
            <div className='card-title mb-3'>{format('operator.header')}</div>
            <AggregatorCapability aggregatorId={organization.id} />
          </div>
      }
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={organization.id}
        objectType={ObjectType.ORGANIZATION}
      />
    </div>
  )
}

export default OrganizationDetailRight
