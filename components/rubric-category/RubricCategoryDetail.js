import { useEffect, useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { RUBRIC_CATEGORY_POLICY_QUERY, RUBRIC_CATEGORY_QUERY } from '../shared/query/rubricCategory'
import { fetchOperationPolicies } from '../utils/policy'
import RubricCategoryDetailLeft from './RubricCategoryDetailLeft'
import RubricCategoryDetailRight from './RubricCategoryDetailRight'

const RubricCategoryDetail = ({ categorySlug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug: categorySlug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  useEffect(() => {
    fetchOperationPolicies(
      client,
      RUBRIC_CATEGORY_POLICY_QUERY,
      ['editing', 'deleting']
    ).then(policies => {
      setEditingAllowed(policies['editing'])
      setDeletingAllowed(policies['deleting'])
    })
  }, [client])

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.rubricCategory) {
    return handleMissingData()
  }

  const { rubricCategory } = data

  const slugNameMapping = (() => {
    const map = {}
    map[rubricCategory.slug] = rubricCategory.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <RubricCategoryDetailLeft
            scrollRef={scrollRef}
            rubricCategory={rubricCategory}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <RubricCategoryDetailRight
            ref={scrollRef}
            rubricCategory={rubricCategory}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default RubricCategoryDetail
