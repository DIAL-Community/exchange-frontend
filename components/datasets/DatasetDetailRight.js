import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import IframeResizer from 'iframe-resizer-react'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlViewer } from '../shared/HtmlViewer'
import CommentsSection from '../shared/comment/CommentsSection'
import { ObjectType } from '../../lib/constants'
import { prependUrlWithProtocol } from '../../lib/utilities'
import { useUser } from '../../lib/hooks'
import DatasetDetailCountries from './DatasetDetailCountries'
import DatasetDetailOrganizations from './DatasetDetailOrganizations'
import DatasetDetailSectors from './DatasetDetailSectors'
import DatasetDetailTags from './DatasetDetailTags'
import DatasetDetailSdgs from './DatasetDetailSdgs'

const DatasetDetailRight = ({ dataset, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser: canEdit } = useUser()
  const slugNameMapping = (() => {
    const map = {}
    map[dataset.slug] = dataset.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      {
        dataset.website &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark inline'>{format('dataset.website')}</div>
            <div className='text-base text-dial-teal flex'>
              <a
                href={prependUrlWithProtocol(dataset.website)}
                className='border-b-2 border-transparent hover:border-dial-sunshine'
                target='_blank'
                rel='noreferrer'
              >
                <div className='my-auto'>{dataset.website} ⧉</div>
              </a>
            </div>
          </div>
      }
      <div className='w-2/3 flex'>
        {
          dataset.datasetType &&
            <div className='mt-12 w-1/3'>
              <div className='card-title mb-3 text-dial-gray-dark inline'>{format('dataset.datasetType')}</div>
              <div className='my-auto'>{dataset.datasetType}</div>
            </div>
        }
        {
          dataset.geographicCoverage &&
            <div className='mt-12 w-1/3'>
              <div className='card-title mb-3 text-dial-gray-dark inline'>{format('dataset.coverage')}</div>
              <div className='my-auto'>{dataset.geographicCoverage}</div>
            </div>
        }
        {
          dataset.license &&
            <div className='mt-12'>
              <div className='card-title mb-3 text-dial-gray-dark inline'>{format('dataset.license')}</div>
              <div className='my-auto'>{dataset.license}</div>
            </div>
        }
      </div>
      <div className='w-2/3 flex'>
        {
          dataset.languages &&
            <div className='mt-12 w-1/3'>
              <div className='card-title mb-3 text-dial-gray-dark inline'>{format('dataset.languages')}</div>
              <div className='my-auto'>{dataset.languages}</div>
            </div>
        }
        {
          dataset.timeRange &&
            <div className='mt-12 w-1/3'>
              <div className='card-title mb-3 text-dial-gray-dark inline'>{format('dataset.timeRange')}</div>
              <div className='my-auto'>{dataset.timeRange}</div>
            </div>
        }
        {
          dataset.dataFormat &&
            <div className='mt-12'>
              <div className='card-title mb-3 text-dial-gray-dark inline'>{format('dataset.dataFormat')}</div>
              <div className='my-auto'>{dataset.dataFormat}</div>
            </div>
        }
      </div>
      <div className='mt-12 card-title mb-3 text-dial-gray-dark'>
        {format('dataset.description')}
        {dataset.manualUpdate && (
          <div className='inline ml-5 h5'>{format('dataset.manualUpdate')}</div>
        )}
      </div>
      <HtmlViewer
        initialContent={dataset?.datasetDescription?.description}
        className='-mb-12'
      />
      {
        dataset.visualizationUrl &&
          <div className='mt-3 v

          '>
            <IframeResizer
              src={dataset.visualizationUrl}
              style={{ position: 'relative', width: '100%' }}
              minHeight="600"
              scrolling='true'
            >
              ${format('dataset.embed.unsupported')}
            </IframeResizer>
          </div>
      }
      {dataset.sustainableDevelopmentGoals && <DatasetDetailSdgs dataset={dataset} canEdit={canEdit} />}
      {dataset.sectors && <DatasetDetailSectors dataset={dataset} canEdit={canEdit} />}
      {dataset.countries && <DatasetDetailCountries dataset={dataset} canEdit={canEdit} />}
      {dataset.organizations && <DatasetDetailOrganizations dataset={dataset} canEdit={canEdit} />}
      {dataset.tags && <DatasetDetailTags dataset={dataset} canEdit={canEdit} />}
      <div className='mt-12 card-title mb-3 text-dial-gray-dark'>{format('dataset.source')}</div>
      <div className='grid grid-cols-3'>
        <div className='pb-5 pr-5'>
          {dataset.origins.map((origin, i) => {
            return (
              <div key={i}>
                <img
                  src={'/images/origins/' + origin.slug + '.png'}
                  height='20px' width='20px' className='inline'
                  alt={format('image.alt.logoFor', { name: origin.name })}
                />
                <div key={i} className='inline ml-2 text-sm'>{origin.name}</div>
                {origin.slug === 'dpga' && (
                  <a
                    className='block ml-3'
                    href={`https://digitalpublicgoods.net/registry/${dataset.slug.replaceAll('_', '-')}`}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <div className='inline ml-4 text-dial-teal text-sm'>{format('dataset.view-DPGA-data')}</div>
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={dataset.id}
        objectType={ObjectType.OPEN_DATA}
      />
    </div>
  )
}

export default DatasetDetailRight
