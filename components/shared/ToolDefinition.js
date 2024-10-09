import { useContext } from 'react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { SiteSettingContext } from '../context/SiteSettingContext'

export const ExternalHeroCardDefinition = ({ heroCardConfiguration }) => {
  const { title, description, imageUrl, destinationUrl } = heroCardConfiguration
  const heroCardName = title
    ? <FormattedMessage id={title} defaultMessage={title} />
    : <FormattedMessage id='ui.siteSetting.heroCard.name' />

  const imageAltText = <FormattedMessage id='ui.image.logoAlt' values={{ name: heroCardName }} />

  return (
    <a
      href={destinationUrl}
      className='rounded-md shadow-lg border'
      target='_blank'
      rel='noopener noreferrer'
    >
      <div className='px-8 pt-6 pb-12'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-x-3'>
            <img src={imageUrl} alt={imageAltText} width={50} height={50} className='object-contain' />
            <div className='text-lg font-light text-dial-ochre my-auto flex-grow'>
              <FormattedMessage id={title} defaultMessage={title} />
            </div>
          </div>
          <div className='text-sm'>
            <FormattedMessage id={description} defaultMessage={description} />
          </div>
        </div>
      </div>
    </a>
  )
}

export const InternalHeroCardDefinition = ({ heroCardConfiguration }) => {
  const { title, description, imageUrl, destinationUrl } = heroCardConfiguration
  const heroCardName = title
    ? <FormattedMessage id={title} defaultMessage={title} />
    : <FormattedMessage id='ui.siteSetting.heroCard.name' />

  const imageAltText = <FormattedMessage id='ui.image.logoAlt' values={{ name: heroCardName }} />

  return (
    <Link href={destinationUrl} className='rounded-md shadow-lg border'>
      <div className='px-8 pt-6 pb-12'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-x-3'>
            <img src={imageUrl} alt={imageAltText} width={50} height={50} className='object-contain' />
            <div className='text-lg font-light my-auto flex-grow'>
              {title && <FormattedMessage id={title} defaultMessage={title} />}
            </div>
          </div>
          <div className='text-sm'>
            {description && <FormattedMessage id={description} defaultMessage={description} />}
          </div>
        </div>
      </div>
    </Link>
  )
}

const ToolDefinition = () => {
  const { heroCardSection } = useContext(SiteSettingContext)
  console.log(heroCardSection)
  const { title, description, heroCardConfigurations } = heroCardSection

  return (
    <div className='lg:px-8 xl:px-56 text-dial-stratos'>
      <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-8'>
        <div className='text-2xl font-semibold'>
          {title && <FormattedMessage id={title} defaultMessage={title} />}
        </div>
        <div className='text-sm max-w-5xl'>
          {description && <FormattedMessage id={description} defaultMessage={description} />}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {heroCardConfigurations?.map(heroCardConfiguration => {
            const { id, external } = heroCardConfiguration

            return external
              ? <ExternalHeroCardDefinition key={id} heroCardConfiguration={heroCardConfiguration} />
              : <InternalHeroCardDefinition key={id} heroCardConfiguration={heroCardConfiguration} />
          })}
        </div>
      </div>
    </div>
  )
}

export default ToolDefinition
