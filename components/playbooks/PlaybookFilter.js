import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { gql } from '@apollo/client'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
import { PlaybookFilterContext, PlaybookFilterDispatchContext } from '../context/PlaybookFilterContext'
import { ProductAutocomplete } from '../filter/element/Product'
import { TagAutocomplete } from '../filter/element/Tag'
import { useUser } from '../../lib/hooks'

const SEARCH_PLAYBOOK_TAGS_QUERY = gql`
  query SearchPlaybookTags($search: String!) {
    searchPlaybookTags(search: $search) {
      id
      name
      slug
    }
  }
`

const PlaybookFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { setHintDisplayed } = useContext(FilterContext)

  const { tags, products } = useContext(PlaybookFilterContext)
  const { setTags, setProducts } = useContext(PlaybookFilterDispatchContext)

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-base'>
          <a
            className={`
              cursor-pointer font-semibold gap-1 hover:underline
              decoration-2 decoration-dial-yellow
            `}
            onClick={() => setHintDisplayed(true)}
          >
            <span className='mr-1'>{format('filter.hint.text')} {format('playbooks.label')}</span>
            <BsQuestionCircleFill className='inline text-xl mb-1 fill-dial-yellow' />
          </a>
        </div>
        { !user && (
          <div className='px-2 mb-4 text-xs'>
            {format('playbook.hint.createPlaybooks')}
          </div>
        )}
        <div className='col-span-11 lg:col-span-6'>
          <div className='text-dial-gray-dark text-xl px-2 py-2'>
            {format('filter.entity', { entity: format('playbooks.label') }).toUpperCase()}
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
            <ProductAutocomplete {...{ products, setProducts }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <TagAutocomplete
              {...{ tags, setTags }}
              tagQuery={SEARCH_PLAYBOOK_TAGS_QUERY}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaybookFilter
