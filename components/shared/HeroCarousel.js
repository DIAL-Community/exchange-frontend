import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useContext } from 'react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SiteSettingContext } from '../context/SiteSettingContext'

export const DigitalExchangeHeroCarousel = ({ carouselConfiguration }) => {
  const carouselTitle = carouselConfiguration.title ?? 'ui.hero.exchange.title'
  const carouselDescription = carouselConfiguration.description ?? 'ui.hero.exchange.tagLine'

  return (
    <div
      className='bg-cover bg-no-repeat'
      style={{
        backgroundImage: 'url("/ui/v1/hero-dx-bg.svg")',
        height: '400px'
      }}
    >
      <div
        className='bg-right bg-no-repeat'
        style={{
          backgroundImage: 'url("/ui/v1/hero-dx-emblem.svg")',
          backgroundPosition: 'top 1rem center',
          height: '400px'
        }}
      >
        <div className='flex flex-col gap-y-6 text-white px-8 xl:px-56 py-[6rem] xl:py-[8rem]'>
          <div className='text-3xl'>
            <FormattedMessage id={carouselTitle} defaultMessage={carouselTitle} />
          </div>
          <div className='text-base max-w-5xl'>
            <FormattedMessage id={carouselDescription} defaultMessage={carouselDescription} />
          </div>
        </div>
      </div>
    </div>
  )
}

export const MarketplaceHeroCarousel = ({ carouselConfiguration }) => {
  const carouselTitle = carouselConfiguration.title ?? 'ui.marketplace.label'
  const carouselDescription = carouselConfiguration.description ?? 'ui.marketplace.description'
  const carouselDestinationUrl = carouselConfiguration.destinationUrl ?? '/opportunities'
  const carouselCalloutTitle = carouselConfiguration.carouselCalloutTitle ?? 'ui.marketplace.browse'

  return (
    <div
      className='bg-cover bg-no-repeat'
      style={{
        backgroundImage: 'url("/ui/v1/wizard-bg.png")',
        height: '400px'
      }}
    >
      <div className='flex flex-col gap-y-6 text-dial-stratos px-8 xl:px-56 py-[6rem] xl:py-[8rem]'>
        <div className='text-3xl'>
          <FormattedMessage id={carouselTitle} defaultMessage={carouselTitle} />
        </div>
        <div className='text-base'>
          <FormattedMessage id={carouselDescription} defaultMessage={carouselDescription} />
        </div>
        <div className='flex text-sm text-dial-stratos'>
          <Link
            href={carouselDestinationUrl}
            className='px-5 py-2.5 bg-dial-plum text-white'
          >
            <FormattedMessage id={carouselCalloutTitle} defaultMessage={carouselCalloutTitle} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export const GenericHeroCarousel = ({ carouselConfiguration }) => {
  const { style } = carouselConfiguration
  const flexAlignment = style === 'center-aligned'
    ? 'flex-justify items-center'
    : style === 'right-aligned'
      ? 'flex-justify items-end'
      : 'flex-justify items-start'

  const { title, description, imageUrl, calloutTitle, external, destinationUrl } = carouselConfiguration
  const validImageUrl = imageUrl.indexOf('//') >= 0 ? imageUrl : `/ui/carousel/${imageUrl}.svg`

  return (
    <div
      className='bg-cover bg-no-repeat'
      style={{
        backgroundImage: `url("${validImageUrl}")`,
        height: '400px'
      }}
    >
      <div className={`flex flex-col ${flexAlignment} gap-y-6 px-8 xl:px-56 py-[6rem] xl:py-[8rem]`}>
        <div className='text-3xl text-dial-white-linen'>
          {title && <FormattedMessage id={title} defaultMessage={title} />}
        </div>
        <div className='text-base text-dial-white-beech'>
          {description && <FormattedMessage id={description} defaultMessage={description} />}
        </div>
        {destinationUrl && calloutTitle &&
          <div className='flex text-sm text-dial-stratos'>
            {external
              ? <a
                href={destinationUrl}
                target='_blank'
                rel='noopener noreferrer'
                role='menuitem'
                className='px-5 py-2.5 bg-dial-plum text-white'
              >
                <FormattedMessage id={calloutTitle} defaultMessage={calloutTitle} />
              </a>
              : <Link href={destinationUrl} className='px-5 py-2.5 bg-dial-plum text-white'>
                <FormattedMessage id={calloutTitle} defaultMessage={calloutTitle} />
              </Link>
            }
          </div>
        }
      </div>
    </div>
  )
}

const HeroCarousel = () => {
  const { carouselConfigurations } = useContext(SiteSettingContext)

  return (
    <div className='h-[345px] xl:h-[400px] intro-start'>
      <Swiper
        pagination={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {carouselConfigurations.map((carouselConfiguration) => (
          <SwiperSlide key={carouselConfiguration.id}>
            {carouselConfiguration.type === 'default.exchange.carousel'
              ? <DigitalExchangeHeroCarousel carouselConfiguration={carouselConfiguration} />
              : carouselConfiguration.type === 'default.marketplace.carousel'
                ? <MarketplaceHeroCarousel carouselConfiguration={carouselConfiguration} />
                : <GenericHeroCarousel carouselConfiguration={carouselConfiguration} />
            }
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroCarousel
