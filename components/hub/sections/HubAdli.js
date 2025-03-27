import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const HubAdli = () => {
  const linkedInUrns = [
    'urn:li:share:7308399666981752832',
    'urn:li:share:7305232320670662656',
    'urn:li:share:7247555650086481920'
  ]

  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 max-w-catalog mx-auto'>
      <div className='text-content'>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 xl:py-8'>
        <Swiper
          pagination={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          modules={[Autoplay, Pagination, Navigation]}
        >
          {linkedInUrns.map((urn) => (
            <SwiperSlide key={urn}>
              <iframe
                src={`https://www.linkedin.com/embed/feed/update/${urn}?collapsed=1`}
                height="800"
                width="100%"
                frameborder="0"
                allowfullscreen=""
                title="Embedded post"
              ></iframe>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='lg:basis-1/2'>
          Read the latest from the ADLI team
        </div>
      </div>
    </div>
  )
}

export default HubAdli
