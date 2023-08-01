import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteBuildingBlock from './DeleteBuildingBlock'
import BuildingBlockDetailWorkflows from './fragments/BuildingBlockDetailWorkflows'
import BuildingBlockDetailProducts from './fragments/BuildingBlockDetailProducts'

const BuildingBlockDetailRight = forwardRef(({ buildingBlock, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !buildingBlock.markdownUrl

  const descRef = useRef()
  const productRef = useRef()
  const workflowRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.product.header', ref: productRef }
  ]), [])

  return (
    <div className='px-4 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          {canEdit &&
            <EditButton
              type='link'
              href={`${REBRAND_BASE_PATH}/building-blocks/${buildingBlock.slug}/edit`}
            />
          }
          {isAdminUser && <DeleteBuildingBlock buildingBlock={buildingBlock} />}
        </div>
        <div className='text-xl font-semibold text-dial-ochre py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={buildingBlock?.buildingBlockDescription?.description}
            editorId='buildingBlock-description'
          />
        </div>
        <hr className='bg-dial-blue-chalk' />
        <div className='flex flex-col gap-y-3'>
          <BuildingBlockDetailProducts
            buildingBlock={buildingBlock}
            canEdit={canEdit}
            headerRef={productRef}
          />
        </div>
        <hr className='bg-dial-blue-chalk mt-6' />
        <div className='flex flex-col gap-y-3'>
          <BuildingBlockDetailWorkflows
            buildingBlock={buildingBlock}
            canEdit={canEdit}
            headerRef={workflowRef}
          />
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={buildingBlock.id}
          objectType={ObjectType.BUILDING_BLOCK}
        />
      </div>
    </div>
  )
})

BuildingBlockDetailRight.displayName = 'BuildingBlockDetailRight'

export default BuildingBlockDetailRight
