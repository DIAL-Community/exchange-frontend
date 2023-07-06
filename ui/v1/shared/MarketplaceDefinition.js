const MarketplaceDefinition = () => {
  return (
    <div className='bg-dial-blueberry'>
      <div className='px-8 xl:px-56 pt-8 pb-12 text-white'>
        <div className='flex flex-col gap-y-3'>
          <div className='text-2xl font-semibold'>
            The Digital Exchange Marketplace
          </div>
          <div className='text-sm max-w-prose'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aliquam at cursus est, luctus vestibulum urna. Phasellus
            quis dolor enim. Sed rhoncus lacus felis, quis lobortis turpis.
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 py-8'>
            <div className='flex flex-col gap-3'>
              <div className='text-lg font-semibold'>
                Opportunities
              </div>
              <div className='text-sm'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at cursus
                est, luctus vestibulum urna. Phasellus quis dolor enim. Sed rhoncus lacus
                felis, quis lobortis turpis.
              </div>
              <a href='' className='hover:text-dial-sunshine'>
                <div className='text-sm'>
                  Learn more
                </div>
              </a>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='text-lg font-semibold'>
                Storefronts
              </div>
              <div className='text-sm'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at cursus
                est, luctus vestibulum urna. Phasellus quis dolor enim. Sed rhoncus lacus
                felis, quis lobortis turpis.
              </div>
              <a href='' className='hover:text-dial-sunshine'>
                <div className='text-sm'>
                  Explore Storefronts
                </div>
              </a>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='text-lg font-semibold'>
                Comparison Tool
              </div>
              <div className='text-sm'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at cursus
                est, luctus vestibulum urna. Phasellus quis dolor enim. Sed rhoncus lacus
                felis, quis lobortis turpis.
              </div>
              <a href='' className='hover:text-dial-sunshine'>
                <div className='text-sm'>
                  Launch the Comparison tool
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceDefinition
