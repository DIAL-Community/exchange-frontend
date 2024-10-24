import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { DATASET_DETAIL_QUERY } from '../shared/query/dataset'
import { ObjectType } from '../utils/constants'
import { prependUrlWithProtocol } from '../utils/utilities'
import DeleteDataset from './buttons/DeleteDataset'
import DatasetDetailCountries from './fragments/DatasetDetailCountries'
import DatasetDetailOrganizations from './fragments/DatasetDetailOrganizations'
import DatasetDetailSdgs from './fragments/DatasetDetailSdgs'
import DatasetDetailTags from './fragments/DatasetDetailTags'

const DatasetSource = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-xl font-semibold text-dial-plum'>
        {format('ui.dataset.source')}
      </div>
      <div className='flex flex-col gap-3 mt-3'>
        {dataset.origins?.length <= 0 &&
          <div className='text-sm'>
            {format('general.na')}
          </div>
        }
        {dataset.origins.map((origin, i) => {
          return (
            <div key={i} className='flex flex-row gap-3'>
              <div className='block w-12 relative'>
                <img
                  className='object-contain'
                  src={'/images/origins/' + origin.slug + '.png'}
                  alt={format('image.alt.logoFor', { name: origin.name })}
                />
              </div>
              <div className='inline my-auto text-sm'>{origin.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const DatasetDetailRight = forwardRef(({ dataset }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const sdgRef = useRef()
  const organizationRef = useRef()
  const countryRef = useRef()
  const tagRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.sdg.header', ref: sdgRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.country.header', ref: countryRef },
      { value: 'ui.tag.header', ref: tagRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${dataset.slug}/edit`

  let editingAllowed = true
  const { error } = useQuery(DATASET_DETAIL_QUERY, {
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
            <EditButton type='link' href={editPath} />
            <DeleteDataset dataset={dataset} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={dataset?.datasetDescription?.description}
            editorId='dataset-description'
          />
        </div>
        {dataset.visualizationUrl &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-plum'>
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
        <hr className='border-b border-dial-blue-chalk my-3' />
        <DatasetSource dataset={dataset} />
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <DatasetDetailSdgs
            dataset={dataset}
            canEdit={editingAllowed}
            headerRef={sdgRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <DatasetDetailOrganizations
            dataset={dataset}
            canEdit={editingAllowed}
            headerRef={organizationRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <DatasetDetailCountries
            dataset={dataset}
            canEdit={editingAllowed}
            headerRef={countryRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <DatasetDetailTags
            dataset={dataset}
            canEdit={editingAllowed}
            headerRef={tagRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={dataset} objectType={ObjectType.DATASET} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={dataset.id}
          objectType={ObjectType.DATASET}
        />
      </div>
    </div>
  )
})

DatasetDetailRight.displayName = 'DatasetDetailRight'

export default DatasetDetailRight
