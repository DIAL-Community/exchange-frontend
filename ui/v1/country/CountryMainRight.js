import CountryListRight from './fragments/CountryListRight'
import CountryForm from './fragments/CountryForm'

const CountryMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <CountryListRight /> }
      { activeTab === 1 && <CountryForm /> }
    </div>
  )
}

export default CountryMainRight
