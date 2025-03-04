import { useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { currentActiveNav, navOptions } from '../utils/header'
import { SiteSettingContext } from '../context/SiteSettingContext'
import Breadcrumb from './Breadcrumb'
import Select from './form/Select'

const Ribbon = ({ ribbonBg, titleKey, titleImage, titleColor, breadcrumb }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { siteColors } = useContext(SiteSettingContext)

  const router = useRouter()
  const { pathname } = router

  const currentNav = useMemo(() => currentActiveNav(format, pathname), [format, pathname])

  const onNavigationChange = (navigation) => {
    router.push(navigation.value)
  }

  const options = useMemo(() => navOptions(format), [format])

  const fetchOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className={`${ribbonBg} ribbon-outer rounded-b-[32px] z-40`}
      style={ siteColors && { backgroundColor: siteColors.tertiary }}>
      <div className='flex flex-col items-center gap-y-1'>
        <div className='mr-auto px-4 lg:px-8 xl:px-24 3xl:px-56 my-3'>
          <Breadcrumb slugNameMapping={breadcrumb} />
        </div>
        <div className='ribbon-inner w-full my-auto'>
          <div className='flex px-4 lg:px-8 xl:px-24 3xl:px-56'>
            <div className='basis-full lg:basis-3/4 flex flex-col gap-4'>
              <div className='flex gap-4 my-auto'>
                {titleImage}
                <div className={`text-2xl font-base ${titleColor} my-auto flex-grow`}
                  style={ siteColors && { color: siteColors.secondary }}>
                  {format(titleKey)}
                </div>
              </div>
            </div>
            <div className='basis-1/4 my-auto z-40 hidden lg:block'>
              <div className='flex flex-col gap-1 text-sm w-prose'>
                <div className='text-dial-slate-600 font-semibold'>
                  {format('ui.shared.navigateTools')}
                </div>
                <Select
                  async
                  aria-label={format('ui.ribbon.nav.ariaLabel')}
                  cacheOptions
                  isBorderless
                  isRibbonMenu
                  defaultOptions={options}
                  loadOptions={fetchOptions}
                  onChange={onNavigationChange}
                  value={currentNav}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ribbon
