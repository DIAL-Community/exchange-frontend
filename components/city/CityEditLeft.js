import CityDetailHeader from './fragments/CityDetailHeader'

const CityEditLeft = ({ city }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <CityDetailHeader city={city}/>
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default CityEditLeft
