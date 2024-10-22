import Disclaimer from '../../shared/footer/DisclaimerLight'
import PoweredBy from '../../shared/footer/PoweredByLight'

const HealthFooter = () => {
  return (
    <div className='bg-health-blue max-w-catalog mx-auto'>
      <img className='w-full' src='/ui/health/footer-img.png' alt='Footer image' />
      <div className='px-6 lg:px-8 xl:px-56 py-8'>
        <div className='flex flex-col lg:flex-row justify-between gap-x-12'>
          <div className='flex flex-col basis-2/5'>
            <a href='//www.africacdc.org/' target='_blank' rel='noreferrer'>
              <img
                src='/ui/health/a-cdc-logo-alt.png'
                alt='Logo of Africa CDC'
                width={256}
                className='object-contain px-4 w-64'
              />
            </a>
            <div className='text-sm text-dial-angel pt-3'>
              A specialized technical institution of the African Union supporting public health initiatives of Member States.
            </div>
          </div>
          <div className='basis-2/5 py-8 lg:py-0'>
            <PoweredBy />
          </div>
          <div className='basis-1/5'>
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthFooter
