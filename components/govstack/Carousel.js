import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const GovStackHero = ({ children }) => {
  return (
    <div
      className='bg-cover bg-no-repeat'
      style={{
        backgroundImage: 'url("/ui/v1/hero-gs-bg.svg")',
        height: '400px'
      }}
    >
      {children}
    </div>
  )
}

const HeroCarousel = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
          <GovStackHero>
            <div className='flex flex-col gap-y-6 text-white px-8 xl:px-56 py-[6rem] xl:py-[8rem]'>
              <div className='text-3xl'>
                {format('ui.hero.govExchange.title')}
              </div>
              <div className='text-base'>
                {format('ui.hero.govExchange.tagLine')}
              </div>
              <div className='flex text-sm text-dial-stratos'>
                <a
                  href='//www.govstack.global/'
                  target='_blank'
                  rel='noreferrer'
                  className='rounded px-5 py-2.5 bg-dial-sunshine'
                >
                  {format('ui.hero.govExchange.learnMore')}
                </a>
              </div>
            </div>
          </GovStackHero>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default HeroCarousel
