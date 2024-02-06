import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import CountryListRight from './fragments/CountryListRight'
import CountryForm from './fragments/CountryForm'

const CountryMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <CountryListRight />
      : <RequireAuth />
    : <CountryListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <CountryForm /> }
    </div>
  )
}

export default CountryMainRight
