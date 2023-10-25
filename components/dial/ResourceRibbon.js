const ResourceRibbon = () => {
  return (
    <div
      className='rounded-b-[64px] z-40 bg-cover bg-top h-[400px] md:h-[300px]'
      style={{
        backgroundImage: 'url("/ui/v1/research-header.png")'
      }}
    >
      <div className='lg:h-[260px] pt-[60px] md:pt-[80px] lg:pt-[20px]'>
        <div className='flex h-full items-center'>
          <div className='px-8 xl:px-56 text-4xl text-white'>
            Digital transformation is constantly evolving. So is our collective knowledge.
            <div className='py-3 text-xl text-white italic'>
            We have created – and curated – a diverse range of resources designed to help those working at the
            forefront of digital transformation around the world build trusted and inclusive digital ecosystems.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceRibbon
