import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { SDG_LIST_QUERY } from '../../shared/query/sdg'
import { SDGFilterContext } from '../../context/SDGFilterContext'
import SdgCard from '../SdgCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = () => {
  const { search } = useContext(SDGFilterContext)

  const { loading, error, data } = useQuery(SDG_LIST_QUERY, {
    variables: { search }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.sdgs) {
    return <NotFound />
  }

  const { sdgs } = data

  return (
    <div className='flex flex-col gap-3'>
      {sdgs.map((sdg, index) =>
        <div key={index}>
          <SdgCard
            index={index}
            sdg={sdg}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
