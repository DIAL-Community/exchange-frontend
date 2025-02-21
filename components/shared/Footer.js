import Disclaimer from './footer/Disclaimer'
import PoweredBy from './footer/PoweredBy'

const Footer = () => {
  return (
    <div className='bg-dial-cotton max-w-catalog mx-auto'>
      <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 py-8'>
        <div className='flex flex-row'>
          <div className='basis-3/5'>
            <PoweredBy />
          </div>
          <div className='basis-2/5'>
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
