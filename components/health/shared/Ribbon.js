import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Breadcrumb from './Breadcrumb'

const Ribbon = ({ ribbonBg, titleKey, titleImage, titleColor, breadcrumb }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className={`${ribbonBg} ribbon-outer rounded-b-[32px] z-40`}>
      <div className='flex flex-col items-center gap-y-1'>
        <div className='mr-auto px-4 lg:px-8 xl:px-56 my-3'>
          <Breadcrumb slugNameMapping={breadcrumb} />
        </div>
        <div className='ribbon-inner w-full my-auto'>
          <div className='flex px-4 lg:px-8 xl:px-56'>
            <div className='basis-full lg:basis-3/4 flex flex-col gap-4'>
              <div className='flex gap-4 my-auto'>
                {titleImage}
                <div className={`text-2xl font-base ${titleColor} my-auto flex-grow`}>
                  {format(titleKey)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ribbon
