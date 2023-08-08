import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType, REBRAND_BASE_PATH } from '../../utils/constants'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { useUser } from '../../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'
import RoleDetailTags from './fragments/RoleDetailTags'
import DeleteRole from './DeleteRole'
import RoleDetailBuildingBlocks from './fragments/RoleDetailBuildingBlocks'
import RoleDetailSdgs from './fragments/RoleDetailSdgs'
import RoleDetailOrganizations from './fragments/RoleDetailOrganizations'
import RoleCard from './RoleCard'
import RoleDetailMaturityScores from './fragments/RoleDetailMaturityScores'

const RoleSource = ({ role }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>{format('role.source')}</div>
      <div className='flex flex-col gap-3'>
        {role.origins?.length <= 0 && <div className='text-sm'>{format('role.noDatasource')}</div>}
        {role.origins.map((origin, i) => {
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
              {origin.slug === 'dpga' && role.endorsers.length === 0 && (
                <div className='inline my-auto text-xs italic'>
                  {format('role.nominee')}
                </div>
              )}
              {origin.slug === 'dpga' && (
                <a
                  href={`https://digitalpublicgoods.net/registry/${role.slug.replaceAll('_', '-')}`}
                  target='_blank'
                  rel='noreferrer'
                  className='my-auto'
                >
                  <div
                    className='inline text-dial-teal text-sm'
                    data-tooltip-id='react-tooltip'
                    data-tooltip-content={format('role.view-DPGA-data')}
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

const RoleEndorser = ({ role }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('role.endorsers')}
      </div>
      {role.endorsers?.length <= 0 && <div className='text-sm'>{format('role.noEndorser')}</div>}
      {role.endorsers.map((endorser, i) => {
        return (
          <div key={i} className='flex flex-row gap-3'>
            <div className='min-w-[3rem]'>
              <img
                alt={format('image.alt.logoFor', { name: endorser.name })}
                data-tooltip-id='react-tooltip'
                data-tooltip-content={format('role.endorsed-by')}
                src={'/images/origins/' + endorser.slug + '.png'}
                className='w-12'
              />
            </div>
            <div className='text-sm whitespace-normal'>
              {format('role.endorsed-by') + endorser.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const RoleInteroperable = ({ role }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('role.interoperable')}
      </div>
      {role.interoperatesWith.length > 0 ? (
        role.interoperatesWith.map((interoperateProd, index) => (
          <div key={index} className='pb-5 mr-6'>
            <RoleCard role={interoperateProd} displayType={DisplayType.SMALL_CARD} />
          </div>
        ))
      ) : (
        <div className='text-sm text-dial-stratos'>
          {format('ui.common.detail.noData', {
            entity: 'interoperable role',
            base: format('ui.role.label')
          })}
        </div>
      )}
    </div>
  )
}

const RoleIncluded = ({ role }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>{format('role.included')}</div>
      {role.includes.length > 0 ? (
        role.includes.map((includeRole, index) => (
          <div key={index} className='pb-5 mr-6'>
            <RoleCard role={includeRole} displayType={DisplayType.SMALL_CARD} />
          </div>
        ))
      ) : (
        <div className='text-sm text-dial-stratos'>
          {format('ui.common.detail.noData', {
            entity: 'included role',
            base: format('ui.role.label')
          })}
        </div>
      )}
    </div>
  )
}

const RoleDetailRight = forwardRef(({ role, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !role.markdownUrl

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
      { value: 'ui.role.pricing.title', ref: pricingRef },
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
            <EditButton type='link' href={`${REBRAND_BASE_PATH}/roles/${role.slug}/edit`} />
            {isAdminUser && <DeleteRole role={role} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={role?.roleDescription?.description}
            editorId='role-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={pricingRef}>
          {format('ui.role.pricing.title')}
        </div>
        <div className='text-sm flex flex-row gap-2'>
          {format('ui.role.pricing.hostingModel')}:
          <div className='font-semibold inline'>
            {role.hostingModel || format('general.na')}
          </div>
        </div>
        <div className='text-sm flex flex-row gap-2'>
          {format('ui.role.pricing.pricingModel')}:
          <div className='font-semibold inline'>
            {role.pricingModel || format('general.na')}
          </div>
        </div>
        <div className='text-sm flex flex-row gap-2'>
          {format('ui.role.pricing.detailPricing')}:
          <div className='inline'>
            {role.pricingDetails
              ? <HtmlViewer
                className='-mb-12'
                initialContent={role?.pricingDetails}
                editorId='pricing-details'
              />
              : <div className='font-semibold inline'>{format('general.na')}</div>
            }
          </div>
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <RoleDetailSdgs role={role} canEdit={canEdit} headerRef={sdgRef} />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <RoleDetailBuildingBlocks
          role={role}
          canEdit={canEdit}
          headerRef={buildingBlockRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <RoleDetailOrganizations
          role={role}
          canEdit={canEdit}
          headerRef={organizationRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='text-dial-meadow text-xl font-semibold'>
        {format('ui.role.details')}
      </div>
      <div className='mt-6'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
          <RoleSource role={role} />
          <RoleEndorser role={role} />
        </div>
      </div>
      <div className='mt-6'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
          <RoleInteroperable role={role} />
          <RoleIncluded role={role} />
        </div>
      </div>
      <div className='text-dial-meadow text-xl font-semibold mt-6'>
        {format('ui.maturityScore.header')}
      </div>
      <div className='text-sm italic'>
        <div
          className='text-sm mb-3 text-dial-gray-dark highlight-link'
          dangerouslySetInnerHTML={{ __html: format('role.maturity.description') }}
        />
      </div>
      <div className='mt-6'>
        <RoleDetailMaturityScores
          slug={role.slug}
          overallMaturityScore={role.overallMaturityScore}
          maturityScoreDetails={role.maturityScoreDetails}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <RoleDetailTags role={role} canEdit={canEdit} headerRef={tagRef} />
      </div>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={role.id}
        objectType={ObjectType.ROLE}
      />
    </div>
  )
})

RoleDetailRight.displayName = 'RoleDetailRight'

export default RoleDetailRight
