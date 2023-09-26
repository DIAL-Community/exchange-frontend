import CountryListLeft from './fragments/CountryListLeft'
import CountrySimpleLeft from './fragments/CountrySimpleLeft'

const CountryMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <CountryListLeft /> }
      { activeTab === 1 && <CountrySimpleLeft />}
    </>
  )
}

export default CountryMainLeft
