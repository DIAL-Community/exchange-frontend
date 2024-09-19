import Disclaimer from '../../shared/footer/DisclaimerLight'
import PoweredBy from '../../shared/footer/PoweredByLight'

const HealthFooter = () => {
  return (
    <div className='bg-health-blue max-w-catalog mx-auto'>
      <img className='w-full' src='/ui/health/footer-img.png' alt='Footer image' />
      <div className='px-6 lg:px-8 xl:px-56 py-8'>
        <div className='flex flex-col lg:flex-row justify-between'>
          <img
            src='/ui/health/a-cdc-logo-alt.png'
            alt='Logo of Africa CDC'
            width={256}
            className='object-contain px-4 w-60'
          />
          <div className='basis-1/4'>
            <PoweredBy />
          </div>
          <div className='basis-1/4'>
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthFooter
