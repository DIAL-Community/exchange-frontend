import Disclaimer from './footer/Disclaimer'
import PoweredBy from './footer/PoweredBy'

const DpiFooter = () => {
  return (
    <div className='bg-dial-deep-purple max-w-catalog mx-auto'>
      <div className='px-6 lg:px-8 xl:px-56 py-8'>
        <div className='flex flex-col lg:flex-row justify-between'>
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

export default DpiFooter
