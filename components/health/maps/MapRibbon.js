const MapRibbon = () => {
  return (
    <div className='bg-health-light-gray'>
      <div className='w-full flex flex-row gap-2'>
        <div className='w-1/2 pl-4 lg:pl-8 xl:pl-56 pr-12 py-12 text-health-blue text-lg flex flex-row gap-2'>
          <div className='flex flex-col gap-2 max-w-prose'>
            <div className='text-3xl leading-tight font-bold py-3'>
              Health Innovation Map
            </div>
            <div className='max-w-prose'>
              Use the interactive map to see which HealthTech solutions have been deployed and used in
              different country contexts.
            </div>
          </div>
        </div>
        <div className='w-1/2 pr-4 lg:pr-8 xl:pr-56 flex items-center'>
          <img className='w-full' alt='Africa CDC Health Marketplace'
            src='/ui/health/landing-img3.png' />
        </div>
      </div>
    </div>
  )
}

export default MapRibbon
