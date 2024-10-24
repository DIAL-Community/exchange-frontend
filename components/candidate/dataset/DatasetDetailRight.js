import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import CommentsSection from '../../shared/comment/CommentsSection'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { CANDIDATE_DATASET_DETAIL_QUERY } from '../../shared/query/candidateDataset'
import { CandidateActionType, ObjectType } from '../../utils/constants'
import { prependUrlWithProtocol } from '../../utils/utilities'
import DatasetActionButton from './fragments/DatasetActionButton'

const DatasetDetailRight = forwardRef(({ dataset }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const editPath = `${dataset.slug}/edit`

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => ([
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  let editingAllowed = true
  const { error } = useQuery(CANDIDATE_DATASET_DETAIL_QUERY, {
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
        {editingAllowed && (
          <div className='flex gap-x-3 ml-auto'>
            <DatasetActionButton dataset={dataset} actionType={CandidateActionType.REJECT} />
            <DatasetActionButton dataset={dataset} actionType={CandidateActionType.APPROVE} />
            <EditButton type='link' href={editPath} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={dataset?.description}
            editorId='dataset-description'
          />
        </div>
        {dataset.datasetType &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('ui.dataset.datasetType')}
              </div>
              <div className='my-auto text-sm'>
                {dataset.datasetType}
              </div>
            </div>
          </>
        }
        {dataset.visualizationUrl &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('ui.dataset.visualizationUrl')}
              </div>
              <div className='my-auto text-sm flex'>
                <a href={prependUrlWithProtocol(dataset.visualizationUrl)} target='_blank' rel='noreferrer'>
                  <div className='border-b border-dial-iris-blue line-clamp-1 break-all'>
                    {dataset.visualizationUrl}
                  </div>
                </a>
                &nbsp;⧉
              </div>
            </div>
          </>
        }
        {dataset.submitterEmail &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('ui.candidate.submitter')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${dataset.submitterEmail}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {dataset.submitterEmail}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
                <FormattedDate value={dataset.createdAt} />
              </div>
            </div>
          </>
        }
        {`${dataset.rejected}` === 'true' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-red-700'>
                {format('ui.candidate.rejectedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${dataset.rejectedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {dataset.rejectedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.rejectedOn')}:</span>
                <FormattedDate value={dataset.rejectedDate} />
              </div>
            </div>
          </>
        }
        {`${dataset.rejected}` === 'false' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-green-700'>
                {format('ui.candidate.approvedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${dataset.approvedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {dataset.approvedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.approvedOn')}:</span>
                <FormattedDate value={dataset.approvedDate} />
              </div>
            </div>
          </>
        }
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={dataset} objectType={ObjectType.CANDIDATE_DATASET} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={dataset.id}
          objectType={ObjectType.CANDIDATE_DATASET}
        />
      </div>
    </div>
  )
})

DatasetDetailRight.displayName = 'DatasetDetailRight'

export default DatasetDetailRight
