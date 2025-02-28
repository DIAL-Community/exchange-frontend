import Disclaimer from '../../shared/footer/DisclaimerLight'
import PoweredBy from '../../shared/footer/PoweredByLight'

const HubFooter = () => {
  return (
    <div className='bg-dial-deep-purple max-w-catalog mx-auto'>
      <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 py-8'>
        <div className='flex flex-row justify-between'>
          <div className='basis-1/2'>
            <PoweredBy />
          </div>
          <div className='basis-1/2'>
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubFooter
