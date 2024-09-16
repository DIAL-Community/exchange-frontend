import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SiteSettingContext } from '../context/SiteSettingContext'

const DigitalExchangeHero = ({ children }) => {
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
        {children}
      </div>
    </div>
  )
}

const MarketplaceHero = ({ children }) => {
  return (
    <div
      className='bg-cover bg-no-repeat'
      style={{
        backgroundImage: 'url("/ui/v1/wizard-bg.svg")',
        height: '400px'
      }}
    >
      {children}
    </div>
  )
}

const GenericHero = ({ heroCarouselConfiguration }) => {
  return (
    <div
      className='bg-cover bg-no-repeat'
      style={{
        backgroundImage: `url("${heroCarouselConfiguration.imageUrl}")`,
        height: '400px'
      }}
    >
      <div className='flex flex-col gap-y-6 text-dial-stratos px-8 xl:px-56 py-[6rem] xl:py-[8rem]'>
        <div className='text-3xl'>
          {heroCarouselConfiguration.name}
        </div>
        <div className='text-base'>
          {heroCarouselConfiguration.description}
        </div>
        <div className='flex text-sm text-dial-stratos'>
          {heroCarouselConfiguration.external
            ? <a
              href={heroCarouselConfiguration.targetUrl}
              target='_blank'
              rel='noopener noreferrer'
              role='menuitem'
              className='rounded px-5 py-2.5 bg-dial-plum text-white'
            >
              {heroCarouselConfiguration.name}
            </a>
            : <Link
              href={heroCarouselConfiguration.targetUrl}
              className='rounded px-5 py-2.5 bg-dial-plum text-white'
            >
              {heroCarouselConfiguration.name}
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

const HeroCarousel = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { heroCarouselConfigurations } = useContext(SiteSettingContext)

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
        <SwiperSlide>
          <DigitalExchangeHero>
            <div className='flex flex-col gap-y-6 text-white px-8 xl:px-56 py-[6rem] xl:py-[8rem]'>
              <div className='text-3xl'>
                {format('ui.hero.exchange.title')}
              </div>
              <div className='text-base max-w-5xl'>
                {format('ui.hero.exchange.tagLine')}
              </div>
            </div>
          </DigitalExchangeHero>
        </SwiperSlide>
        <SwiperSlide>
          <MarketplaceHero>
            <div className='flex flex-col gap-y-6 text-dial-stratos px-8 xl:px-56 py-[6rem] xl:py-[8rem]'>
              <div className='text-3xl'>
                {format('ui.marketplace.label')}
              </div>
              <div className='text-base'>
                {format('ui.marketplace.description')}
              </div>
              <div className='flex text-sm text-dial-stratos'>
                <Link
                  href='/opportunities'
                  className='rounded px-5 py-2.5 bg-dial-plum text-white'
                >
                  {format('ui.marketplace.browse')}
                </Link>
              </div>
            </div>
          </MarketplaceHero>
        </SwiperSlide>
        {heroCarouselConfigurations.map((heroCarouselConfiguration) => (
          <SwiperSlide key={heroCarouselConfiguration.slug}>
            <GenericHero heroCarouselConfiguration={heroCarouselConfiguration} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroCarousel
