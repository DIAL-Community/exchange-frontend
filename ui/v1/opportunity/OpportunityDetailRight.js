import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import OpportunityDetailTags from './fragments/OpportunityDetailTags'
import DeleteOpportunity from './DeleteOpportunity'
import OpportunityDetailBuildingBlocks from './fragments/OpportunityDetailBuildingBlocks'
import OpportunityDetailOrganizations from './fragments/OpportunityDetailOrganizations'

const OpportunityDetailRight = forwardRef(({ opportunity, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !opportunity.markdownUrl

  const descRef = useRef()
  const pricingRef = useRef()
  const sdgRef = useRef()
  const buildingBlockRef = useRef()
  const organizationRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.opportunity.pricing.title', ref: pricingRef },
      { value: 'ui.sdg.header', ref: sdgRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.tag.header', ref: tagRef }
    ],
    []
  )

  const editPath = `${opportunity.slug}/edit`

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteOpportunity opportunity={opportunity} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={opportunity?.description}
            editorId='opportunity-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <OpportunityDetailBuildingBlocks
          opportunity={opportunity}
          canEdit={canEdit}
          headerRef={buildingBlockRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <OpportunityDetailOrganizations
          opportunity={opportunity}
          canEdit={canEdit}
          headerRef={organizationRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <OpportunityDetailTags
          opportunity={opportunity}
          canEdit={canEdit}
          headerRef={tagRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={opportunity.id}
        objectType={ObjectType.OPPORTUNITY}
      />
    </div>
  )
})

OpportunityDetailRight.displayName = 'OpportunityDetailRight'

export default OpportunityDetailRight