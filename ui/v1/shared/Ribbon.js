import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Select from '../../../components/shared/Select'
import { currentActiveNav, navOptions } from '../utils/header'

const Ribbon = () => {
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
    <div className='bg-dial-blue-chalk ribbon-outer rounded-b-[32px]'>
      <div className='ribbon-inner w-full px-32'>
        <div className='h-28 flex'>
          <div className='basis-1/2 flex gap-8'>
            <img
              src='/ui/v1/use-case-header.png'
              alt='Logo for use case header.'
              width={70}
              height={70}
              className='object-contain'
            />
            <div className='text-3xl text-dial-sapphire my-auto flex-grow'>
              {format('useCase.header')}
            </div>
          </div>
          <div className='h-28 basis-1/3 flex ml-auto'>
            <div className='block basis-1/2 ml-auto my-auto'>
              <div className='flex flex-col gap-1'>
                <div className='text-sm text-dial-slate-600 font-semibold'>
                  Navigate Tools
                </div>
                <Select
                  async
                  aria-label='Current active navigation'
                  cacheOptions
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
