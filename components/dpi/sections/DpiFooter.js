import Connect from '../../shared/footer/Connect'
import Disclaimer from '../../shared/footer/Disclaimer'
import Partner from '../../shared/footer/Partner'
import PoweredBy from '../../shared/footer/PoweredBy'

const DpiFooter = () => {
  return (
    <div className='bg-dial-cotton max-w-catalog mx-auto'>
      <div className='px-6 lg:px-8 xl:px-56 py-8'>
        <div className='flex flex-col'>
          <div className='flex flex-col lg:flex-row gap-x-12 xl:gap-x-48'>
            <div className='basis-3/5'>
              <Connect />
            </div>
            <div className='basis-2/5'>
              <PoweredBy />
            </div>
          </div>
          <div className='flex flex-col lg:flex-row gap-x-12 xl:gap-x-48'>
            <div className='basis-3/5'>
              <Partner />
            </div>
            <div className='basis-2/5 mt-auto'>
              <Disclaimer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DpiFooter
