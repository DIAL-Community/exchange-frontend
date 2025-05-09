import classNames from 'classnames'
import Link from 'next/link'
import { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { SiteSettingContext } from '../context/SiteSettingContext'
import { HtmlViewer } from './form/HtmlViewer'

export const ExternalHeroCardDefinition = ({ disabled, heroCardConfiguration }) => {
  const { title, description, imageUrl, destinationUrl } = heroCardConfiguration
  const heroCardName = title
    ? <FormattedMessage id={title} defaultMessage={title} />
    : <FormattedMessage id='ui.siteSetting.heroCard.name' />

  const imageAltText = <FormattedMessage id='ui.image.logoAlt' values={{ name: heroCardName }} />

  return (
    <a
      href={destinationUrl}
      className={classNames(
        'rounded-md shadow-lg border h-full',
        disabled || !destinationUrl ? 'cursor-default' : 'cursor-pointer'
      )}
      target='_blank'
      rel='noopener noreferrer'
      onClick={(e) => { if (disabled || !destinationUrl) e.preventDefault() }}
    >
      <div className='px-8 pt-6 pb-12 h-full'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-x-3'>
            <img src={imageUrl} alt={imageAltText} width={50} height={50} className='object-contain' />
            <div className='text-lg font-light text-dial-ochre my-auto flex-grow'>
              <FormattedMessage id={title} defaultMessage={title} />
            </div>
          </div>
          <div className='text-sm flex-grow'>
            <FormattedMessage id={description} defaultMessage={description} />
          </div>
        </div>
      </div>
    </a>
  )
}

export const InternalHeroCardDefinition = ({ disabled, heroCardConfiguration }) => {
  const { title, description, imageUrl, destinationUrl } = heroCardConfiguration
  const heroCardName = title
    ? <FormattedMessage id={title} defaultMessage={title} />
    : <FormattedMessage id='ui.siteSetting.heroCard.name' />

  const imageAltText = <FormattedMessage id='ui.image.logoAlt' values={{ name: heroCardName }} />

  return (
    <Link
      href={destinationUrl}
      className={classNames(
        'rounded-md shadow-lg border h-full',
        disabled || !destinationUrl ? 'cursor-default' : 'cursor-pointer'
      )}
      onClick={(e) => { if (disabled || !destinationUrl) e.preventDefault() }}
    >
      <div className='px-8 pt-6 pb-12 h-full'>
        <div className='flex flex-col gap-6 h-full'>
          <div className='flex flex-row gap-x-3'>
            <img src={imageUrl} alt={imageAltText} width={50} height={50} className='object-contain' />
            <div className='text-lg font-light my-auto flex-grow'>
              {title && <FormattedMessage id={title} defaultMessage={title} />}
            </div>
          </div>
          <div className='text-sm flex-grow'>
            {description && <FormattedMessage id={description} defaultMessage={description} />}
          </div>
        </div>
      </div>
    </Link>
  )
}

const ToolDefinition = () => {
  const { heroCardSection } = useContext(SiteSettingContext)
  const { title, description, wysiwygDescription, heroCardConfigurations } = heroCardSection

  return (
    <div className='lg:px-8 xl:px-56 text-dial-stratos'>
      <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-8'>
        {wysiwygDescription
          ? <HtmlViewer initialContent={wysiwygDescription} />
          : <div className='flex flex-col gap-y-8'>
            <div className='text-2xl font-semibold'>
              {title && <FormattedMessage id={title} defaultMessage={title} />}
            </div>
            <div className='text-sm max-w-5xl'>
              {description && <FormattedMessage id={description} defaultMessage={description} />}
            </div>
          </div>
        }
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
