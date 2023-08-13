import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_CONTACTS_QUERY } from '../../shared/query/contact'
import { FilterContext } from '../../../../components/context/FilterContext'
import ContactCard from '../ContactCard'
import { DisplayType } from '../../utils/constants'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CONTACTS_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedContacts) {
    return <NotFound />
  }

  const { paginatedContacts: contacts } = data

  return (
    <div className='flex flex-col gap-3'>
      {contacts.map((contact, index) =>
        <div key={index}>
          <ContactCard
            index={index}
            contact={contact}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
