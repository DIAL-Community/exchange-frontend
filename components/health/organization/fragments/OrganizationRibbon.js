import Breadcrumb from '../../../shared/Breadcrumb'

const OrganizationRibbon = () => {
  return (
    <div className='bg-health-light-gray'>
      <div className='mr-auto px-4 lg:px-8 xl:px-24 3xl:px-56 my-3 text-health-blue'>
        <Breadcrumb slugNameMapping='organization' />
      </div>
      <div className='w-full flex flex-row gap-2'>
        <div className='w-1/2 pl-4 lg:pl-8 xl:pl-56 pr-12 py-12 text-health-blue text-lg flex flex-row gap-2'>
          <div className='flex flex-col gap-2 max-w-prose'>
            <div className='text-3xl leading-tight font-bold py-3'>
              Digital Health Solution Providers
            </div>
            <div className='max-w-prose'>
              These are the organizations that are creating innovative health solutions in Africa.
            </div>
          </div>
        </div>
        <img className='h-80 w-1/2 pr-4 lg:pr-8 xl:pr-56' alt='Africa CDC Health Marketplace'
          src='/ui/health/landing-img1.png' />
      </div>
    </div>
  )
}

export default OrganizationRibbon
