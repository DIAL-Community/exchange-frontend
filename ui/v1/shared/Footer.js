import Connect from './footer/Connect'
import Disclaimer from './footer/Disclaimer'
import Partner from './footer/Partner'
import PoweredBy from './footer/PoweredBy'

const Footer = () => {
  return (
    <div className='bg-dial-cotton max-w-catalog mx-auto'>
      <div className='px-56 py-8'>
        <div className='flex flex-col px-6'>
          <div className='flex gap-x-48'>
            <div className='basis-3/5'>
              <Connect />
            </div>
            <div className='basis-2/5'>
              <PoweredBy />
            </div>
          </div>
          <div className='flex gap-8'>
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

export default Footer