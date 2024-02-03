import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import OrganizationCard from '../organization/OrganizationCard'
import ProjectCard from '../project/ProjectCard'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { DisplayType, ObjectType } from '../utils/constants'
import DeleteCountry from './DeleteCountry'

const CountryMarker = dynamic(() => import('./fragments/CountryMarker'), { ssr:false })

const CountryDetailRight = forwardRef(({ country }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const descRef = useRef()
  const organizationRef = useRef()
  const projectRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.project.header', ref: projectRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${country.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteCountry country={country} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <CountryMarker country={country} />
        <div className='flex flex-col gap-y-3'>
          <div className='text-sm text-dial-stratos'>
            {format('country.code')}: {country?.code}
          </div>
          <div className='text-sm text-dial-stratos'>
            {format('country.codeLonger')}: {country?.codeLonger}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={organizationRef}>
            {format('ui.organization.header')}
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
            {country?.organizations.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.organization.label'),
                  base: format('ui.country.label')
                })}
              </div>
            }
            {country?.organizations?.map((organization, index) =>
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
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={projectRef}>
            {format('ui.project.header')}
          </div>
          <div className='flex flex-col gap-y-4'>
            {country?.projects.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.project.label'),
                  base: format('ui.country.label')
                })}
              </div>
            }
            {country?.projects?.map((project, index) =>
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
          <Bookmark object={country} objectType={ObjectType.COUNTRY} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={country.id}
          objectType={ObjectType.COUNTRY}
        />
      </div>
    </div>
  )
})

CountryDetailRight.displayName = 'CountryDetailRight'

export default CountryDetailRight
