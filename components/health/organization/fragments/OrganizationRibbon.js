import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Breadcrumb from '../../../shared/Breadcrumb'

const OrganizationRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/organization-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
      width={70}
      height={70}
      className='object-contain'
    />

  return (
    <div className={'bg-dial-spearmint ribbon-outer rounded-b-[32px] z-40'}>
      <div className='flex flex-col items-center gap-y-1'>
        <div className='mr-auto px-4 lg:px-8 xl:px-56 my-3'>
          <Breadcrumb slugNameMapping='organization' />
        </div>
        <div className='ribbon-inner w-full my-auto'>
          <div className='flex px-4 lg:px-8 xl:px-56'>
            <div className='basis-full lg:basis-3/4 flex flex-col gap-4'>
              <div className='flex gap-4 my-auto'>
                {titleImage}
                <div className={'text-2xl font-base text-dial-meadow my-auto flex-grow'}>
                  {format('ui.organization.header')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationRibbon
