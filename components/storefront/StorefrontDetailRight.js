import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useOrganizationOwnerUser, useUser } from '../../../lib/hooks'
import Share from '../shared/common/Share'
import Bookmark from '../shared/common/Bookmark'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteStorefront from './DeleteStorefront'
import StorefrontDetailCountries from './fragments/StorefrontDetailCountries'
import StorefrontDetailProjects from './fragments/StorefrontDetailProjects'
import StorefrontDetailContacts from './fragments/StorefrontDetailContacts'
import StorefrontDetailOffices from './fragments/StorefrontDetailOffices'
import StorefrontDetailResources from './fragments/StorefrontDetailResources'
import StorefrontDetailSpecialties from './fragments/StorefrontDetailSpecialties'
import StorefrontDetailProductCertifications from './fragments/StorefrontDetailProducts'
import StorefrontDetailBuildingBlockCertifications from './fragments/StorefrontDetailBuildingBlocks'

const StorefrontDetailRight = forwardRef(({ organization }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(organization)

  const canEdit = isAdminUser || isEditorUser || isOrganizationOwner

  const descRef = useRef()
  const specialtyRef = useRef()
  const resourceRef = useRef()
  const productCertificationRef = useRef()
  const buildingBlockCertificationRef = useRef()
  const officeRef = useRef()
  const contactRef = useRef()
  const projectRef = useRef()
  const countryRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.specialty.header', ref: specialtyRef },
      { value: 'ui.resource.header', ref: resourceRef },
      { value: 'ui.productCertification.header', ref: productCertificationRef },
      { value: 'ui.buildingBlockCertification.header', ref: buildingBlockCertificationRef },
      { value: 'ui.office.header', ref: officeRef },
      { value: 'ui.contact.header', ref: contactRef },
      { value: 'ui.project.header', ref: projectRef },
      { value: 'ui.country.header', ref: countryRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${organization.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-4'>
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
          {canEdit && (
            <div className='absolute right-3 top-3 flex gap-x-3 ml-auto'>
              <EditButton type='link' href={editPath} />
              {isAdminUser && <DeleteStorefront organization={organization} />}
            </div>
          )}
          <div className={classNames(
            'w-full absolute bottom-0 left-0 z-10',
            'transform translate-y-1/2 lg:w-auto lg:translate-x-8',
            'flex justify-center')}
          >
            <div className='w-44 h-44 bg-white border border-dial-angel'>
              <div className='flex justify-center items-center w-full h-full'>
                <img
                  fill
                  className='object-contain px-3'
                  alt={format('image.alt.logoFor', { name: organization.name })}
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
            {format('ui.common.detail.description')}
          </div>
          <div className='block'>
            <HtmlViewer
              initialContent={organization?.organizationDescription?.description}
              editorId='organization-description'
            />
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <StorefrontDetailSpecialties
            organization={organization}
            canEdit={canEdit}
            headerRef={specialtyRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <StorefrontDetailResources
            organization={organization}
            canEdit={canEdit}
            headerRef={resourceRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <StorefrontDetailProductCertifications
            organization={organization}
            canEdit={canEdit}
            headerRef={productCertificationRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <StorefrontDetailBuildingBlockCertifications
            organization={organization}
            canEdit={canEdit}
            headerRef={buildingBlockCertificationRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <StorefrontDetailOffices
            organization={organization}
            canEdit={canEdit}
            headerRef={officeRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <StorefrontDetailContacts
            organization={organization}
            canEdit={canEdit}
            headerRef={contactRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <StorefrontDetailProjects
            organization={organization}
            canEdit={canEdit}
            headerRef={projectRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <StorefrontDetailCountries
            organization={organization}
            canEdit={canEdit}
            headerRef={countryRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='block lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={organization} objectType={ObjectType.ORGANIZATION} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={organization.id}
          objectType={ObjectType.ORGANIZATION}
        />
      </div>
    </div>
  )
})

StorefrontDetailRight.displayName = 'StorefrontDetailRight'

export default StorefrontDetailRight
