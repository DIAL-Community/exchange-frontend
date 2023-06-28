import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import classNames from 'classnames'
import Breadcrumb from '../../shared/breadcrumb'
import { HtmlViewer } from '../../shared/HtmlViewer'
import CommentsSection from '../../shared/comment/CommentsSection'
import { ObjectType } from '../../../lib/constants'
import { prependUrlWithProtocol } from '../../../lib/utilities'
import { useOrganizationOwnerUser, useUser } from '../../../lib/hooks'
import OrganizationDetailCountries from '../OrganizationDetailCountries'
import OrganizationDetailSectors from '../OrganizationDetailSectors'
import OrganizationDetailProjects from '../OrganizationDetailProjects'
import OrganizationDetailContacts from '../OrganizationDetailContacts'
import OrganizationDetailProducts from '../OrganizationDetailProducts'
import OrganizationDetailOffices from '../OrganizationDetailOffices'
import StorefrontDetailSpecialties from './StorefrontDetailSpecialties'
import StorefrontDetailResources from './StorefrontDetailResources'
import StorefrontDetailBuildingBlocks from './StorefrontDetailBuildingBlocks'
import StorefrontDetailProducts from './StorefrontDetailProducts'

const sectionHeaderStyle = 'card-title mb-3 text-dial-gray-dark'

const DynamicOfficeMarker = (props) => {
  const OfficeMarker = useMemo(() => dynamic(
    () => import('../../shared/MapMarker'),
    { loading: () => <div>Loading Map data ...</div>, ssr: false }
  ), [])

  return <OfficeMarker {...props} />
}

const StorefrontDetailRight = ({ organization, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

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

  const createProject = () => {
    router.push(`/storefronts/${organization.slug}/projects/create`)
  }

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col'>
        <div className='relative mb-32'>
          {!organization.heroFile &&
            <div className='w-full h-64 bg-gradient-to-r from-dial-sapphire to-dial-lavender' />
          }
          {organization.heroFile &&
            <img
              className='object-cover object-center w-full h-64'
              alt={format('image.alt.logoFor', { name: organization.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.heroFile}
            />
          }
          <div className={classNames(
            'w-full absolute bottom-0 left-0 z-10',
            'transform translate-y-1/2 lg:w-auto lg:translate-x-8',
            'flex justify-center')}
          >
            <div className='bg-dial-angel w-44 h-44 py-4'>
              <div className='relative w-36 h-36 rounded-full m-auto bg-white'>
                <Image
                  fill
                  className='object-contain px-3'
                  alt={format('image.alt.logoFor', { name: organization.name })}
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='text-sm text-dial-purple-light'>
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
        <div className={`mt-8 ${sectionHeaderStyle}`}>
          {format('product.description')}
        </div>
        <HtmlViewer
          initialContent={organization?.organizationDescription?.description}
          className='-mb-12'
        />
        <StorefrontDetailSpecialties organization={organization} canEdit={canEdit} />
        <StorefrontDetailResources organization={organization} canEdit={canEdit} />
        <StorefrontDetailProducts organization={organization} canEdit={canEdit} />
        {marker && <DynamicOfficeMarker {...marker} />}
        {canEdit && <OrganizationDetailOffices organization={organization} canEdit={canEdit} />}
        {canEdit && <OrganizationDetailContacts organization={organization}/>}
        <StorefrontDetailBuildingBlocks organization={organization} canEdit={canEdit} />
        <OrganizationDetailSectors organization={organization} canEdit={canEdit} />
        <OrganizationDetailCountries organization={organization} canEdit={canEdit} />
        <OrganizationDetailProducts organization={organization} canEdit={canEdit} />
        <OrganizationDetailProjects
          organization={organization}
          canEdit={canEdit}
          createAction={createProject}
        />
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={organization.id}
          objectType={ObjectType.ORGANIZATION}
        />
      </div>
    </div>
  )
}

export default StorefrontDetailRight
