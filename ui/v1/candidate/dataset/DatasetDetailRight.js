import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType, REBRAND_BASE_PATH } from '../../utils/constants'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { useUser } from '../../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'

const DatasetDetailRight = forwardRef(({ dataset, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !dataset.markdownUrl

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
      { value: 'ui.dataset.pricing.title', ref: pricingRef },
      { value: 'ui.sdg.header', ref: sdgRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.candidateOrganization.header', ref: organizationRef },
      { value: 'ui.tag.header', ref: tagRef }
    ],
    []
  )

  const editPath = `${REBRAND_BASE_PATH}/candidate/datasets/${dataset.slug}/edit`

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={dataset?.description}
            editorId='dataset-description'
          />
        </div>
      </div>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={dataset.id}
        objectType={ObjectType.DATASET}
      />
    </div>
  )
})

DatasetDetailRight.displayName = 'DatasetDetailRight'

export default DatasetDetailRight