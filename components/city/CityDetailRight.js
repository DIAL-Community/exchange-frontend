import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { EDITING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import CountryCard from '../country/CountryCard'
import OrganizationCard from '../organization/OrganizationCard'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { CITY_DETAIL_QUERY } from '../shared/query/city'
import { DisplayType, ObjectType } from '../utils/constants'
import DeleteCity from './buttons/DeleteCity'

const CityMarker = dynamic(() => import('./fragments/CityMarker'), { ssr:false })

const CityDetailRight = forwardRef(({ city }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const countryRef = useRef()
  const organizationRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.country.label', ref: countryRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${city.slug}/edit`

  let editingAllowed = true
  const { error } = useQuery(CITY_DETAIL_QUERY, {
    variables: { slug: EDITING_POLICY_SLUG },
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
            <DeleteCity city={city} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <CityMarker city={city} />
        <div className='text-sm text-dial-stratos'>
          {format('ui.city.description', {
            provinceName: city.province.name,
            countryName: city.province.country.name
          })}
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-plum' ref={countryRef}>
            {format('ui.country.label')}
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
            <CountryCard country={city.province.country} displayType={DisplayType.SMALL_CARD} />
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={organizationRef}>
            {format('ui.organization.header')}
          </div>
          {city?.organizations.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.organization.label'),
                base: format('ui.city.label')
              })}
            </div>
          }
          {city?.organizations.length > 0 &&
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
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
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={city} objectType={ObjectType.CITY} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={city.id}
          objectType={ObjectType.CITY}
        />
      </div>
    </div>
  )
})

CityDetailRight.displayName = 'CityDetailRight'

export default CityDetailRight
