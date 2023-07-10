import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { currentActiveNav, navOptions } from '../utils/header'
import Select from './form/Select'

const Ribbon = ({ ribbonBg, titleKey, titleImage, titleColor }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { pathname } = router

  const [currentNav, setCurrentNav] = useState()

  const onNavigationChange = (navigation) => {
    router.push(navigation.value)
  }

  const options = useMemo(() => navOptions(format), [format])

  const fetchOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  useEffect(() => {
    setCurrentNav(currentActiveNav(format, pathname))
  }, [pathname, format])

  return (
    <div className={`${ribbonBg} ribbon-outer rounded-b-[32px] z-40`}>
      <div className='ribbon-inner w-full px-8 xl:px-56'>
        <div className='h-24 flex'>
          <div className='basis-3/4 flex gap-4'>
            { titleImage }
            <div className={`text-2xl font-light ${titleColor} my-auto flex-grow`}>
              {format(titleKey)}
            </div>
          </div>
          <div className='basis-1/4 ml-auto my-auto z-40'>
            <div className='flex flex-col gap-1 text-sm w-prose'>
              <div className='text-dial-slate-600 font-semibold'>
                {format('ui.shared.navigateTools')}
              </div>
              <Select
                async
                aria-label={format('ui.ribbon.nav.ariaLabel')}
                cacheOptions
                isBorderless
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
  )
}

export default Ribbon