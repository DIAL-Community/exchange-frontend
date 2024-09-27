import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { ObjectType } from '../utils/constants'
import DeleteSiteSetting from './DeleteSiteSetting'
import { generateCarouselHeaderText, generateMenuHeaderText } from './utilities'

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
        <div className='text-base font-semibold py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={siteSetting?.description}
            editorId='siteSetting-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='flex pb-3' ref={carouselConfigurationsRef}>
            <div className='text-base font-semibold'>
              {format('ui.siteSetting.carousel.header')}
            </div>
            <div className='flex gap-x-2 ml-auto'>
              {canEdit &&
                <EditButton type='link' href={`${siteSetting.slug}/carousel-configurations`} />
              }
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            {siteSetting?.carouselConfigurations.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.siteSetting.carousel.label'),
                  base: format('ui.siteSetting.label')
                })}
              </div>
            }
            <div className='flex flex-col gap-1 text-sm'>
              {siteSetting?.carouselConfigurations?.map((carouselConfiguration, index) =>
                <div key={index} className='flex flex-col gap-1'>
                  <div className='border shadow px-4 py-3 flex gap-1'>
                    <FormattedMessage
                      id={carouselConfiguration.name}
                      defaultMessage={carouselConfiguration.name}
                    />
                    <span className='text-xs font-normal my-auto'>
                      ({generateCarouselHeaderText(carouselConfiguration)})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='flex pb-3' ref={heroCardConfigurationsRef}>
            <div className='text-base font-semibold'>
              {format('ui.siteSetting.heroCard.header')}
            </div>
            <div className='flex gap-x-2 ml-auto'>
              {canEdit &&
                <EditButton type='link' href={`${siteSetting.slug}/hero-card-configurations`} />
              }
            </div>
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='flex pb-3' ref={menuConfigurationsRef}>
            <div className='text-base font-semibold'>
              {format('ui.siteSetting.menu.header')}
            </div>
            <div className='flex gap-x-2 ml-auto'>
              {canEdit &&
                <EditButton type='link' href={`${siteSetting.slug}/menu-configurations`} />
              }
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            {siteSetting?.menuConfigurations.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.siteSetting.menu.label'),
                  base: format('ui.siteSetting.label')
                })}
              </div>
            }
            <div className='flex flex-col gap-1 text-sm'>
              {siteSetting?.menuConfigurations?.map((menuConfiguration, index) =>
                <div key={index} className='flex flex-col gap-1'>
                  <div className='border shadow px-4 py-3 flex gap-1'>
                    <FormattedMessage
                      id={menuConfiguration.name}
                      defaultMessage={menuConfiguration.name}
                    />
                    <span className='text-xs font-normal my-auto'>
                      ({generateMenuHeaderText(menuConfiguration)})
                    </span>
                  </div>
                  {menuConfiguration.menuItemConfigurations.map((menuItemConfiguration, index) => (
                    <div key={index} className='ml-4 border shadow px-4 py-3 flex gap-1'>
                      <FormattedMessage
                        id={menuItemConfiguration.name}
                        defaultMessage={menuItemConfiguration.name}
                      />
                      <span className='text-xs font-normal my-auto'>
                        ({generateMenuHeaderText(menuItemConfiguration)})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-3'>
          <Bookmark object={siteSetting} objectType={ObjectType.SITE_SETTING} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
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
