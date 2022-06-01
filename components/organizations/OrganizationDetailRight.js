import { FormattedDate, useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/client'
import Breadcrumb from '../shared/breadcrumb'
import CityCard from '../cities/CityCard'
import AggregatorCapability from './AggregatorCapability'
import OrganizationDetailCountries from './OrganizationDetailCountries'
import OrganizationDetailSectors from './OrganizationDetailSectors'
import OrganizationDetailProjects from './OrganizationDetailProjects'
import OrganizationDetailContacts from './OrganizationDetailContacts'
import OrganizationDetailProducts from './OrganizationDetailProducts'

const sectionHeaderStyle = 'card-title mb-3 text-dial-gray-dark'

const DynamicOfficeMarker = (props) => {
  const OfficeMarker = useMemo(() => dynamic(
    () => import('./OfficeMarker'),
    {
      loading: () => <div>Loading Map data ...</div>,
      ssr: false
    }
  ), [props])

  return <OfficeMarker {...props} />
}

const OrganizationDetailRight = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [session] = useSession()

  const canEdit = session?.user?.canEdit || session?.user?.own?.organization?.id === organization.id

  const marker = organization.offices.length > 0
    ? {
      position: [parseFloat(organization.offices[0].latitude), parseFloat(organization.offices[0].longitude)],
      title: organization.name,
      body: organization.offices[0].name
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
          <div className='text-base text-dial-teal'>
            <a href={`//${organization.website}`} className='flex flex-row' target='_blank' rel='noreferrer'>
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
                <div className='text-base text-dial-yellow pb-2'>
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
      <div className='fr-view text-dial-gray-dark p-3'>
        {organization.organizationDescription && parse(organization.organizationDescription.description)}
      </div>
      {
        organization.offices.length > 1 &&
          <div className='mt-12'>
            <div className={sectionHeaderStyle}>{format('office.other.header')}</div>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              {
                organization.offices.map((office, i) => {
                  // Skipping the first one because it is displayed as map marker.
                  if (i === 0) return <></>

                  return <CityCard key={i} city={office} listType='list' />
                })
              }
            </div>
          </div>
      }
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
    </div>
  )
}

export default OrganizationDetailRight
