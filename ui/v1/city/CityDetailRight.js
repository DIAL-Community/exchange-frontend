import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { useUser } from '../../../lib/hooks'
import OrganizationCard from '../organization/OrganizationCard'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteCity from './DeleteCity'

const CityMarker = dynamic(() => import('./fragments/CityMarker'), { ssr:false })

const CityDetailRight = forwardRef(({ city, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !city.markdownUrl

  const descRef = useRef()
  const organizationRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.organizationRef.header', ref: organizationRef }
    ],
    []
  )

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={`${REBRAND_BASE_PATH}/cities/${city.slug}/edit`} />
            {isAdminUser && <DeleteCity city={city} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <CityMarker city={city} />
        <div className='text-sm text-dial-stratos'>
          {format('ui.city.description', {
            regionName: city.region.name,
            countryName: city.region.country.name
          })}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={organizationRef}>
          {format('ui.organization.header')}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4'>
          {city?.organizations?.map((organization, index) =>
            <div key={`organization-${index}`}>
              <OrganizationCard
                index={index}
                organization={organization}
                displayType={DisplayType.SMALL_CARD}
              />
            </div>
          )}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={city.id}
        objectType={ObjectType.CITY}
      />
    </div>
  )
})

CityDetailRight.displayName = 'CityDetailRight'

export default CityDetailRight
