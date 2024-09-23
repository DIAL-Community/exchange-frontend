import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { ObjectType } from '../utils/constants'
import DeleteSiteSetting from './DeleteSiteSetting'

const SiteSettingDetailRight = forwardRef(({ siteSetting }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const descRef = useRef()
  const carouselConfigurationsRef = useRef()
  const heroCardConfigurationsRef = useRef()
  const menuConfigurationsRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.siteSetting.carousel.header', ref: carouselConfigurationsRef },
      { value: 'ui.siteSetting.heroCard.header', ref: heroCardConfigurationsRef },
      { value: 'ui.siteSetting.menu.header', ref: menuConfigurationsRef }
    ],
    []
  )

  const editPath = `${siteSetting.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteSiteSetting siteSetting={siteSetting} />}
          </div>
        )}
        <div className='text-xl font-semibold py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={siteSetting?.description}
            editorId='siteSetting-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold pb-3' ref={carouselConfigurationsRef}>
            {format('ui.siteSetting.carousel.header')}
          </div>
          <div className='flex flex-col gap-y-4'>
            {siteSetting?.carouselConfigurations.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.siteSetting.carousel.label'),
                  base: format('ui.siteSetting.label')
                })}
              </div>
            }
            {siteSetting?.carouselConfigurations?.map((carouselConfiguration, index) =>
              <div key={`project-${index}`}>
                {carouselConfiguration.name}
              </div>
            )}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold pb-3' ref={heroCardConfigurationsRef}>
            {format('ui.siteSetting.carousel.header')}
          </div>
          <div className='flex flex-col gap-y-4'>
            {siteSetting?.carouselConfigurations.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.siteSetting.heroCard.label'),
                  base: format('ui.siteSetting.label')
                })}
              </div>
            }
            {siteSetting?.carouselConfigurations?.map((carouselConfiguration, index) =>
              <div key={`project-${index}`}>
                {carouselConfiguration.name}
              </div>
            )}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold pb-3' ref={menuConfigurationsRef}>
            {format('ui.siteSetting.menu.header')}
          </div>
          <div className='flex flex-col gap-y-4'>
            {siteSetting?.menuConfigurations.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.siteSetting.menu.label'),
                  base: format('ui.siteSetting.label')
                })}
              </div>
            }
            {siteSetting?.menuConfigurations?.map((menuConfiguration, index) =>
              <div key={`project-${index}`}>
                {menuConfiguration.name}
              </div>
            )}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={siteSetting} objectType={ObjectType.SITE_SETTING} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={siteSetting.id}
          objectType={ObjectType.SITE_SETTING}
        />
      </div>
    </div>
  )
})

SiteSettingDetailRight.displayName = 'SiteSettingDetailRight'

export default SiteSettingDetailRight
