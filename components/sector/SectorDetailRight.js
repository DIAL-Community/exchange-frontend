import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { EDITING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import DatasetCard from '../dataset/DatasetCard'
import OrganizationCard from '../organization/OrganizationCard'
import ProductCard from '../product/ProductCard'
import ProjectCard from '../project/ProjectCard'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { SECTOR_POLICY_QUERY } from '../shared/query/sector'
import { DisplayType, ObjectType } from '../utils/constants'
import DeleteSector from './buttons/DeleteSector'

const SectorDetailRight = forwardRef(({ sector }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const datasetRef = useRef()
  const organizationRef = useRef()
  const productRef = useRef()
  const projectRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.dataset.header', ref: datasetRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.product.header', ref: productRef },
      { value: 'ui.project.header', ref: projectRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${sector.slug}/edit`

  let editingAllowed = false
  const { error } = useQuery(SECTOR_POLICY_QUERY, {
    variables: { slug: EDITING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (!error) {
    editingAllowed = true
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          <DeleteSector sector={sector} />
        </div>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={sector?.sectorDescription?.description}
            editorId='sector-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={datasetRef}>
            {format('ui.dataset.header')}
          </div>
          {sector?.datasets.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.dataset.label'),
                base: format('ui.sector.label')
              })}
            </div>
          }
          {sector?.datasets.length > 0 &&
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
              {sector?.datasets?.map((dataset, index) =>
                <div key={`dataset-${index}`}>
                  <DatasetCard
                    index={index}
                    dataset={dataset}
                    displayType={DisplayType.SMALL_CARD}
                  />
                </div>
              )}
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={organizationRef}>
            {format('ui.organization.header')}
          </div>
          {sector?.organizations.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.organization.label'),
                base: format('ui.sector.label')
              })}
            </div>
          }
          {sector?.organizations.length > 0 &&
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
              {sector?.organizations?.map((organization, index) =>
                <div key={`useCase-${index}`}>
                  <OrganizationCard
                    index={index}
                    organization={organization}
                    displayType={DisplayType.SMALL_CARD}
                  />
                </div>
              )}
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={productRef}>
            {format('ui.product.header')}
          </div>
          {sector?.products.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.product.label'),
                base: format('ui.sector.label')
              })}
            </div>
          }
          { sector?.products.length > 0 &&
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
              {sector?.products?.map((product, index) =>
                <div key={`product-${index}`}>
                  <ProductCard
                    index={index}
                    product={product}
                    displayType={DisplayType.SMALL_CARD}
                  />
                </div>
              )}
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={projectRef}>
            {format('ui.project.header')}
          </div>
          <div className='flex flex-col gap-y-4'>
            {sector?.projects.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.project.label'),
                  base: format('ui.sector.label')
                })}
              </div>
            }
            {sector?.projects?.map((project, index) =>
              <div key={`project-${index}`}>
                <ProjectCard
                  index={index}
                  project={project}
                  displayType={DisplayType.SMALL_CARD}
                />
              </div>
            )}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={sector} objectType={ObjectType.SECTOR} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={sector.id}
          objectType={ObjectType.SECTOR}
        />
      </div>
    </div>
  )
})

SectorDetailRight.displayName = 'SectorDetailRight'

export default SectorDetailRight
