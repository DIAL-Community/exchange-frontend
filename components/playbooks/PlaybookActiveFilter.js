import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { QueryParamContext } from '../context/QueryParamContext'
import { PlaybookFilterContext, PlaybookFilterDispatchContext } from '../context/PlaybookFilterContext'
import { parseQuery } from '../shared/SharableLink'

import { ProductFilters } from '../filter/element/Product'
import { TagFilters } from '../filter/element/Tag'

import dynamic from 'next/dynamic'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const PlaybookActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { tags, products } = useContext(PlaybookFilterContext)
  const { setTags, setProducts } = useContext(PlaybookFilterDispatchContext)

  const filterCount = () => {
    let count = 0
    count = count + tags.length + products.length
    return count
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setProducts([])
    setTags([])
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'playbooks'

    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)
    const productFilters = products.map(product => `products=${product.value}--${product.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, ...productFilters, ...tagFilters
    ].filter(f => f).join('&')
    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      parseQuery(query, 'products', products, setProducts)
      parseQuery(query, 'tags', tags, setTags)
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
      <div className='flex flex-row flex-wrap px-3 gap-2'>
        <ProductFilters {...{ products, setProducts }} />
        <TagFilters {...{ tags, setTags }} />

        <div className='flex px-2 py-1 mt-2 text-sm text-dial-gray-dark'>
          <a
            className='border-b-2 border-transparent hover:border-dial-yellow my-auto opacity-50'
            href='#clear-filter' onClick={clearFilter}
          >
            {format('filter.general.clearAll')}
          </a>
          <div className='border-r border-dial-gray mx-2 opacity-50' />
          <SharableLink sharableLink={sharableLink} />
        </div>
      </div>
    </div>
  )
}

export default PlaybookActiveFilter
