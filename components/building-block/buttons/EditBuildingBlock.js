import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import EditButton from '../../shared/form/EditButton'
import { BUILDING_BLOCK_DETAIL_QUERY } from '../../shared/query/buildingBlock'

const EditBuildingBlock = ({ buildingBlock }) => {

  const { data } = useQuery(BUILDING_BLOCK_DETAIL_QUERY, {
    variables: { slug: buildingBlock.slug },
    fetchPolicy: 'network-only',
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  return (data &&
    <EditButton type='link' href={`/building-blocks/${buildingBlock.slug}/edit`} />
  )
}

export default EditBuildingBlock
