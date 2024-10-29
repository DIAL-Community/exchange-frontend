import { useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT, GRAPH_QUERY_POLICY_SLUG } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { CATEGORY_INDICATOR_POLICY_QUERY, CATEGORY_INDICATOR_QUERY } from '../shared/query/categoryIndicator'
import { fetchOperationPolicies } from '../utils/policy'
import CategoryIndicatorDetailLeft from './CategoryIndicatorDetailLeft'
import CategoryIndicatorDetailRight from './CategoryIndicatorDetailRight'

const CategoryIndicatorDetail = ({ categorySlug, indicatorSlug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(CATEGORY_INDICATOR_QUERY, {
    variables: { categorySlug, indicatorSlug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.categoryIndicator && !data.rubricCategory) {
    return handleMissingData()
  }

  const { categoryIndicator, rubricCategory } = data

  fetchOperationPolicies(
    client,
    CATEGORY_INDICATOR_POLICY_QUERY,
    ['editing', 'deleting'],
    { categorySlug: GRAPH_QUERY_POLICY_SLUG, indicatorSlug: GRAPH_QUERY_POLICY_SLUG }
  ).then(policies => {
    setEditingAllowed(policies['editing'])
    setDeletingAllowed(policies['deleting'])
  })

  const slugNameMapping = (() => {
    const map = {}
    map[rubricCategory.slug] = rubricCategory.name
    map[categoryIndicator.slug] = categoryIndicator.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <CategoryIndicatorDetailLeft
            scrollRef={scrollRef}
            rubricCategory={rubricCategory}
            categoryIndicator={categoryIndicator}
          />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <CategoryIndicatorDetailRight
            ref={scrollRef}
            rubricCategory={rubricCategory}
            categoryIndicator={categoryIndicator}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryIndicatorDetail
