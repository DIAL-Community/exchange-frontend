import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { gql } from '@apollo/client'
import { PlaybookFilterContext, PlaybookFilterDispatchContext } from '../context/PlaybookFilterContext'
import { ProductAutocomplete } from '../filter/element/Product'
import { TagAutocomplete } from '../filter/element/Tag'
import { useUser } from '../../lib/hooks'
import PlaybookHint from '../filter/hint/PlaybookHint'

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

  const { tags, products } = useContext(PlaybookFilterContext)
  const { setTags, setProducts } = useContext(PlaybookFilterDispatchContext)

  const [openingDetail, setOpeningDetail] = useState(false)
  const toggleHintDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  return (
    <div className='pt-6 pb-10 bg-dial-solitude rounded-lg text-dial-stratos'>
      <div className='text-dial-stratos flex flex-col gap-3'>
        <div className='px-6 text-base flex'>
          <a
            className='cursor-pointer font-semibold flex gap-2'
            onClick={() => toggleHintDetail()}
          >
            <div className='w-6 my-auto image-block-hack'>
              <Image
                width={34}
                height={34}
                src='/assets/info.png'
                alt='Informational hint'
              />
            </div>
            <span className='py-1 border-b-2 border-transparent hover:border-dial-sunshine'>
              {format('filter.hint.text')} {format('playbooks.label')}
            </span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <PlaybookHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        { !user &&
          <div className='px-6 text-xs'>
            {format('playbook.hint.createPlaybooks')}
          </div>
        }
        <div className='text-xl px-6'>
          {format('filter.entity', { entity: format('playbooks.label') }).toUpperCase()}
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <ProductAutocomplete {...{ products, setProducts }} />
          <TagAutocomplete {...{ tags, setTags }} tagQuery={SEARCH_PLAYBOOK_TAGS_QUERY} />
        </div>
      </div>
    </div>
  )
}

export default PlaybookFilter
