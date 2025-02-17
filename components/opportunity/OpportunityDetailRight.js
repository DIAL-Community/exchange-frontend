import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { ObjectType } from '../utils/constants'
import DeleteOpportunity from './fragments/DeleteOpportunity'
import OpportunityDetailBuildingBlocks from './fragments/OpportunityDetailBuildingBlocks'
import OpportunityDetailCountries from './fragments/OpportunityDetailCountries'
import OpportunityDetailOrganizations from './fragments/OpportunityDetailOrganizations'
import OpportunityDetailTags from './fragments/OpportunityDetailTags'
import OpportunityDetailUseCases from './fragments/OpportunityDetailUseCases'

const OpportunityDetailRight = forwardRef(({ opportunity, editingAllowed, deletingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const countryRef = useRef()
  const buildingBlockRef = useRef()
  const organizationRef = useRef()
  const useCaseRef = useRef()
  const tagRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.country.header', ref: countryRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.useCase.header', ref: useCaseRef },
      { value: 'ui.tag.header', ref: tagRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${opportunity.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          { deletingAllowed && <DeleteOpportunity opportunity={opportunity} /> }
        </div>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='description-block'>
          <HtmlViewer
            initialContent={opportunity?.description}
            editorId='opportunity-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OpportunityDetailCountries
            opportunity={opportunity}
            editingAllowed={editingAllowed}
            headerRef={countryRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OpportunityDetailBuildingBlocks
            opportunity={opportunity}
            editingAllowed={editingAllowed}
            headerRef={buildingBlockRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OpportunityDetailOrganizations
            opportunity={opportunity}
            editingAllowed={editingAllowed}
            headerRef={organizationRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OpportunityDetailUseCases
            opportunity={opportunity}
            editingAllowed={editingAllowed}
            headerRef={useCaseRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OpportunityDetailTags
            opportunity={opportunity}
            editingAllowed={editingAllowed}
            headerRef={tagRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={opportunity} objectType={ObjectType.OPPORTUNITY} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={opportunity.id}
          objectType={ObjectType.OPPORTUNITY}
        />
      </div>
    </div>
  )
})

OpportunityDetailRight.displayName = 'OpportunityDetailRight'

export default OpportunityDetailRight
