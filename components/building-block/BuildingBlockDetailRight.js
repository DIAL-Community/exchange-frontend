import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { BUILDING_BLOCK_POLICY_QUERY } from '../shared/query/buildingBlock'
import { ObjectType } from '../utils/constants'
import DeleteBuildingBlock from './buttons/DeleteBuildingBlock'
import BuildingBlockDetailProducts from './fragments/BuildingBlockDetailProducts'
import BuildingBlockDetailWorkflows from './fragments/BuildingBlockDetailWorkflows'

const BuildingBlockDetailRight = forwardRef(({ buildingBlock }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const productRef = useRef()
  const workflowRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.product.header', ref: productRef },
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  let editingAllowed = !buildingBlock.markdownUrl
  const { error } = useQuery(BUILDING_BLOCK_POLICY_QUERY, {
    variables: { slug: crypto.randomUUID() },
    fetchPolicy: 'no-cache',
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (error) {
    editingAllowed = false
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={`/building-blocks/${buildingBlock.slug}/edit`} />}
          <DeleteBuildingBlock buildingBlock={buildingBlock} />
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
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <BuildingBlockDetailProducts
            buildingBlock={buildingBlock}
            editingAllowed={editingAllowed}
            headerRef={productRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <BuildingBlockDetailWorkflows
            buildingBlock={buildingBlock}
            editingAllowed={editingAllowed}
            headerRef={workflowRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={buildingBlock} objectType={ObjectType.BUILDING_BLOCK} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
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
