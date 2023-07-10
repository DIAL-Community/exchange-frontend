import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
  return (
    <div className='h-[345px] xl:h-[400px]'>
      <Swiper
        pagination={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
      >
        <SwiperSlide>
          <DigitalExchangeHero>
            <div className='flex flex-col gap-y-6 text-white px-8 xl:px-56 py-[6rem] xl:py-[8rem]'>
              <div className='text-3xl'>Welcome</div>
              <div className='text-base max-w-prose'>
                The Digital Impact Exchange enables digital changemakers to connect,
                collaborate and exchange tools, knowledge and best practices in the
                collective pursuit of the Sustainable Development Goals
              </div>
            </div>
          </DigitalExchangeHero>
        </SwiperSlide>
        <SwiperSlide>
          <GovStackHero>
            <div className='flex flex-col gap-y-6 text-white px-8 xl:px-56 py-[6rem] xl:py-[8rem]'>
              <div className='text-3xl'>GovStack</div>
              <div className='text-base'>Accelerating the digital transformation of government services</div>
              <div className='flex text-sm text-dial-stratos'>
                <button className='rounded px-5 py-2.5 bg-dial-sunshine'>
                  Learn more
                </button>
              </div>
            </div>
          </GovStackHero>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default HeroCarousel