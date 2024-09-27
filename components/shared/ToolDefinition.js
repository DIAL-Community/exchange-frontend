import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { FormattedMessage, useIntl } from 'react-intl'
import { SiteSettingContext } from '../context/SiteSettingContext'

export const ExternalHeroCardDefinition = ({ heroCardConfiguration }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <a
      href={heroCardConfiguration.destinationUrl}
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
              <FormattedMessage
                id={heroCardConfiguration.name}
                defaultMessage={heroCardConfiguration.name}
              />
            </div>
          </div>
          <div className='text-sm'>
            <FormattedMessage
              id={heroCardConfiguration.description}
              defaultMessage={heroCardConfiguration.description}
            />
          </div>
        </div>
      </div>
    </a>
  )
}

export const InternalHeroCardDefinition = ({ heroCardConfiguration }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <Link href={heroCardConfiguration.destinationUrl} className='rounded-md shadow-lg border'>
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
              <FormattedMessage
                id={heroCardConfiguration.name}
                defaultMessage={heroCardConfiguration.name}
              />
            </div>
          </div>
          <div className='text-sm'>
            <FormattedMessage
              id={heroCardConfiguration.description}
              defaultMessage={heroCardConfiguration.description}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

const ToolDefinition = () => {
  const { heroCardSection } = useContext(SiteSettingContext)
  const { title, description, heroCardConfigurations } = heroCardSection

  return (
    <div className='lg:px-8 xl:px-56 text-dial-stratos'>
      <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-8'>
        <div className='text-2xl font-semibold'>
          <FormattedMessage id={title} defaultMessage={title} />
        </div>
        <div className='text-sm max-w-5xl'>
          <FormattedMessage id={description} defaultMessage={description} />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
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
