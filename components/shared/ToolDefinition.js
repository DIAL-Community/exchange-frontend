import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { SiteSettingContext } from '../context/SiteSettingContext'

const ExternalHeroCardDefinition = ({ heroCardConfiguration }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <a
      href={heroCardConfiguration.targetUrl}
      className='rounded-md shadow-lg border'
      target='_blank'
      rel='noopener noreferrer'
    >
      <div className='px-8 pt-6 pb-12'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-x-3'>
            <img
              src={heroCardConfiguration.imageUrl}
              alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
              width={50}
              height={50}
              className='object-contain'
            />
            <div className='text-lg font-light text-dial-ochre my-auto flex-grow'>
              {heroCardConfiguration.name}
            </div>
          </div>
          <div className='text-sm'>
            {heroCardConfiguration.description}
          </div>
        </div>
      </div>
    </a>
  )
}

const InternalHeroCardDefinition = ({ heroCardConfiguration }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <Link href={heroCardConfiguration.targetUrl} className='rounded-md shadow-lg border'>
      <div className='px-8 pt-6 pb-12'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-x-3'>
            <img
              src={heroCardConfiguration.imageUrl}
              alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
              width={50}
              height={50}
              className='object-contain'
            />
            <div className='text-lg font-light text-dial-ochre my-auto flex-grow'>
              {heroCardConfiguration.name}
            </div>
          </div>
          <div className='text-sm'>
            {heroCardConfiguration.description}
          </div>
        </div>
      </div>
    </Link>
  )
}

const ToolDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { heroCardConfigurations } = useContext(SiteSettingContext)

  return (
    <div className='lg:px-8 xl:px-56 text-dial-stratos'>
      <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-8'>
        <div className='text-2xl font-semibold'>
          {format('ui.tool.getStarted')} ...
        </div>
        <div className='text-sm max-w-5xl'>
          {format('ui.tool.tagLine')}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <Link href='/use-cases' className='rounded-md shadow-lg border'>
            <div className='px-8 py-6'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/use-case-header.svg'
                    alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-blueberry my-auto flex-grow'>
                    {format('ui.useCase.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  {format('useCase.hint.subtitle')}
                </div>
              </div>
            </div>
          </Link>
          <Link href='/building-blocks' className='rounded-md shadow-lg border'>
            <div className='px-8 pt-6 pb-12'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/building-block-header.svg'
                    alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-ochre my-auto flex-grow'>
                    {format('ui.buildingBlock.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  {format('buildingBlock.hint.subtitle')}
                </div>
              </div>
            </div>
          </Link>
          <Link href='/products' className='rounded-md shadow-lg border'>
            <div className='px-8 py-6'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/product-header.svg'
                    alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-meadow my-auto flex-grow'>
                    {format('ui.product.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  {format('product.hint.subtitle')}
                </div>
              </div>
            </div>
          </Link>
          {heroCardConfigurations.map(heroCardConfiguration => {
            return heroCardConfiguration.external
              ? <ExternalHeroCardDefinition
                key={heroCardConfiguration.slug}
                heroCardConfiguration={heroCardConfiguration}
              />
              : <InternalHeroCardDefinition
                key={heroCardConfiguration.slug}
                heroCardConfiguration={heroCardConfiguration}
              />
          })}
        </div>
      </div>
    </div>
  )
}

export default ToolDefinition
