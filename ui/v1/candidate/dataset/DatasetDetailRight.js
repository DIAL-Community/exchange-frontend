import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType, REBRAND_BASE_PATH } from '../../utils/constants'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { useUser } from '../../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'
import DatasetDetailTags from './fragments/DatasetDetailTags'
import DeleteDataset from './DeleteDataset'
import DatasetDetailBuildingBlocks from './fragments/DatasetDetailBuildingBlocks'
import DatasetDetailSdgs from './fragments/DatasetDetailSdgs'
import DatasetDetailOrganizations from './fragments/DatasetDetailOrganizations'
import DatasetCard from './DatasetCard'
import DatasetDetailMaturityScores from './fragments/DatasetDetailMaturityScores'

const DatasetSource = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>{format('dataset.source')}</div>
      <div className='flex flex-col gap-3'>
        {dataset.origins?.length <= 0 && <div className='text-sm'>{format('dataset.noDatasource')}</div>}
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
              {origin.slug === 'dpga' && dataset.endorsers.length === 0 && (
                <div className='inline my-auto text-xs italic'>
                  {format('dataset.nominee')}
                </div>
              )}
              {origin.slug === 'dpga' && (
                <a
                  href={`https://digitalpublicgoods.net/registry/${dataset.slug.replaceAll('_', '-')}`}
                  target='_blank'
                  rel='noreferrer'
                  className='my-auto'
                >
                  <div
                    className='inline text-dial-teal text-sm'
                    data-tooltip-id='react-tooltip'
                    data-tooltip-content={format('dataset.view-DPGA-data')}
                  >
                    <BsQuestionCircleFill className='inline text-xl fill-dial-sapphire' />
                  </div>
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const DatasetEndorser = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('dataset.endorsers')}
      </div>
      {dataset.endorsers?.length <= 0 && <div className='text-sm'>{format('dataset.noEndorser')}</div>}
      {dataset.endorsers.map((endorser, i) => {
        return (
          <div key={i} className='flex flex-row gap-3'>
            <div className='min-w-[3rem]'>
              <img
                alt={format('image.alt.logoFor', { name: endorser.name })}
                data-tooltip-id='react-tooltip'
                data-tooltip-content={format('dataset.endorsed-by')}
                src={'/images/origins/' + endorser.slug + '.png'}
                className='w-12'
              />
            </div>
            <div className='text-sm whitespace-normal'>
              {format('dataset.endorsed-by') + endorser.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const DatasetInteroperable = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('dataset.interoperable')}
      </div>
      {dataset.interoperatesWith.length > 0 ? (
        dataset.interoperatesWith.map((interoperateProd, index) => (
          <div key={index} className='pb-5 mr-6'>
            <DatasetCard dataset={interoperateProd} displayType={DisplayType.SMALL_CARD} />
          </div>
        ))
      ) : (
        <div className='text-sm text-dial-stratos'>
          {format('ui.common.detail.noData', {
            entity: 'interoperable dataset',
            base: format('ui.dataset.label')
          })}
        </div>
      )}
    </div>
  )
}

const DatasetIncluded = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>{format('dataset.included')}</div>
      {dataset.includes.length > 0 ? (
        dataset.includes.map((includeDataset, index) => (
          <div key={index} className='pb-5 mr-6'>
            <DatasetCard dataset={includeDataset} displayType={DisplayType.SMALL_CARD} />
          </div>
        ))
      ) : (
        <div className='text-sm text-dial-stratos'>
          {format('ui.common.detail.noData', {
            entity: 'included dataset',
            base: format('ui.dataset.label')
          })}
        </div>
      )}
    </div>
  )
}

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
            <EditButton type='link' href={`${REBRAND_BASE_PATH}/datasets/${dataset.slug}/edit`} />
            {isAdminUser && <DeleteDataset dataset={dataset} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={dataset?.datasetDescription?.description}
            editorId='dataset-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={pricingRef}>
          {format('ui.dataset.pricing.title')}
        </div>
        <div className='text-sm flex flex-row gap-2'>
          {format('ui.dataset.pricing.hostingModel')}:
          <div className='font-semibold inline'>
            {dataset.hostingModel || format('general.na')}
          </div>
        </div>
        <div className='text-sm flex flex-row gap-2'>
          {format('ui.dataset.pricing.pricingModel')}:
          <div className='font-semibold inline'>
            {dataset.pricingModel || format('general.na')}
          </div>
        </div>
        <div className='text-sm flex flex-row gap-2'>
          {format('ui.dataset.pricing.detailPricing')}:
          <div className='inline'>
            {dataset.pricingDetails
              ? <HtmlViewer
                className='-mb-12'
                initialContent={dataset?.pricingDetails}
                editorId='pricing-details'
              />
              : <div className='font-semibold inline'>{format('general.na')}</div>
            }
          </div>
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <DatasetDetailSdgs dataset={dataset} canEdit={canEdit} headerRef={sdgRef} />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <DatasetDetailBuildingBlocks
          dataset={dataset}
          canEdit={canEdit}
          headerRef={buildingBlockRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <DatasetDetailOrganizations
          dataset={dataset}
          canEdit={canEdit}
          headerRef={organizationRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='text-dial-meadow text-xl font-semibold'>
        {format('ui.dataset.details')}
      </div>
      <div className='mt-6'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
          <DatasetSource dataset={dataset} />
          <DatasetEndorser dataset={dataset} />
        </div>
      </div>
      <div className='mt-6'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
          <DatasetInteroperable dataset={dataset} />
          <DatasetIncluded dataset={dataset} />
        </div>
      </div>
      <div className='text-dial-meadow text-xl font-semibold mt-6'>
        {format('ui.maturityScore.header')}
      </div>
      <div className='text-sm italic'>
        <div
          className='text-sm mb-3 text-dial-gray-dark highlight-link'
          dangerouslySetInnerHTML={{ __html: format('dataset.maturity.description') }}
        />
      </div>
      <div className='mt-6'>
        <DatasetDetailMaturityScores
          slug={dataset.slug}
          overallMaturityScore={dataset.overallMaturityScore}
          maturityScoreDetails={dataset.maturityScoreDetails}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <DatasetDetailTags dataset={dataset} canEdit={canEdit} headerRef={tagRef} />
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
