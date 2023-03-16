import Link from 'next/link'
import { DisplayType } from '../../lib/constants'
import { useUser } from '../../lib/hooks'

const CountryCard = ({ country, listType }) => {
  const { isAdminUser } = useUser()

  const noAuthCardContent =
    <div className='border-3 border-transparent'>
      <div className='bg-white border border-dial-gray card-drop-shadow'>
        <div className='p-4 font-semibold text-button-gray'>
          {country.name}
        </div>
      </div>
    </div>

  const withAuthCardContent =
    <Link data-testid='country-card' className='card-link' href={`/countries/${country.slug}`}>
      <a href={`/countries/${country.slug}`}>
        <div className='border-3 border-transparent hover:border-dial-sunshine'>
          <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
            <div className='p-4 font-semibold text-button-gray'>
              {country.name}
            </div>
          </div>
        </div>
      </a>
    </Link>

  return (
    <>
      {listType === DisplayType.LIST && isAdminUser && withAuthCardContent}
      {listType === DisplayType.LIST && !isAdminUser && noAuthCardContent}
    </>
  )
}

export default CountryCard
