import { useSession } from 'next-auth/client'
import classNames from 'classnames'
import { useUser } from '../../lib/hooks'
import { DisplayType } from '../../lib/constants'
import DeleteCountry from './DeleteCountry'

const CountryCard = ({ country, listType, displayEditButtons }) => {
  const [ session ] = useSession()
  const { isAdminUser } = useUser(session)

  return (
    <>
      {
        listType === DisplayType.LIST &&
          (
            <div className='border-3 border-transparent'>
              <div className='border border-dial-gray card-drop-shadow'>
                <div className='flex justify-between my-4 px-4'>
                  <div className={classNames({ 'w-1/2 md:w-3/4': displayEditButtons }, 'inline-block font-semibold text-button-gray')}>
                    {country.name}
                  </div>
                  {isAdminUser && displayEditButtons &&
                    <div className='inline-flex gap-x-1.5 items-center'>
                      <DeleteCountry country={country} />
                    </div>
                  }
                </div>
              </div>
            </div>
          )
      }
    </>
  )
}

export default CountryCard
