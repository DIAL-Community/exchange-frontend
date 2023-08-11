import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteOrganization from './DeleteOrganization'
import OrganizationDetailProducts from './fragments/OrganizationDetailProducts'
import OrganizationDetailCountries from './fragments/OrganizationDetailCountries'

const OrganizationDetailRight = forwardRef(({ organization, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !organization.markdownUrl

  const descRef = useRef()
  const productRef = useRef()
  const countryRef = useRef()
  const buildingBlockRef = useRef()
  const organizationRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.product.header', ref: productRef },
      { value: 'ui.countryRef.header', ref: countryRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.tag.header', ref: tagRef }
    ],
    []
  )

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={`${REBRAND_BASE_PATH}/organizations/${organization.slug}/edit`} />
            {isAdminUser && <DeleteOrganization organization={organization} />}
          </div>
        )}
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
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <OrganizationDetailProducts
          organization={organization}
          canEdit={canEdit}
          headerRef={productRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <OrganizationDetailCountries
          organization={organization}
          canEdit={canEdit}
          headerRef={countryRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={organization.id}
        objectType={ObjectType.ORGANIZATION}
      />
    </div>
  )
})

OrganizationDetailRight.displayName = 'OrganizationDetailRight'

export default OrganizationDetailRight
