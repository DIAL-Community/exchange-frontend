import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteDataset from './DeleteDataset'
import DatasetDetailTags from './fragments/DatasetDetailTags'
import DatasetDetailOrganizations from './fragments/DatasetDetailOrganizations'
import DatasetDetailSdgs from './fragments/DatasetDetailSdgs'
import DatasetDetailCountries from './fragments/DatasetDetailCountries'

const DatasetSource = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-plum'>
        {format('dataset.source')}
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

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !dataset.markdownUrl

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

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteDataset dataset={dataset} />}
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
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <DatasetSource dataset={dataset} />
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <DatasetDetailSdgs dataset={dataset} canEdit={canEdit} headerRef={sdgRef} />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <DatasetDetailOrganizations
          dataset={dataset}
          canEdit={canEdit}
          headerRef={organizationRef}
        />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <DatasetDetailCountries
          dataset={dataset}
          canEdit={canEdit}
          headerRef={countryRef}
        />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <DatasetDetailTags
          dataset={dataset}
          canEdit={canEdit}
          headerRef={tagRef}
        />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6 mb-3' />
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
