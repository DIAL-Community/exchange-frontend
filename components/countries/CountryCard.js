import { useSession } from 'next-auth/client'
import Link from 'next/link'
import { useUser } from '../../lib/hooks'
import { DisplayType } from '../../lib/constants'
import DeleteCountry from './DeleteCountry'

const CountryCard = ({ country, listType, displayEditButtons }) => {
  const [ session ] = useSession()
  const { isAdminUser } = useUser(session)

  return (
    <>
      {listType === DisplayType.LIST &&
        (
          <div className='border-3 cursor-pointer border-transparent hover:border-dial-yellow'>
            <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
              <div className='flex my-4 px-4'>
                <Link data-testid='country-card' className='card-link' href={`/countries/${country.slug}`}>
                  <a className='w-1/2 md:w-3/4'>
                    <div className='font-semibold text-button-gray'>
                      {country.name}
                    </div>
                  </a>
                </Link>
                {isAdminUser && displayEditButtons &&
                  <div className='inline-flex gap-x-1.5 ml-auto items-center'>
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
