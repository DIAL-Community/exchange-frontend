import { useContext } from 'react'
import { ResourceFilterContext, ResourceFilterDispatchContext } from '../../context/ResourceFilterContext'
import SearchBar from '../../shared/SearchBar'

const HubResourceSearchBar = () => {
  const { search } = useContext(ResourceFilterContext)
  const { setSearch } = useContext(ResourceFilterDispatchContext)

  return (
    <SearchBar search={search} setSearch={setSearch} />
  )
}

export default HubResourceSearchBar
