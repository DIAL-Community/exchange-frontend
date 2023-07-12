import Link from 'next/link'
import { useCallback, useContext } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import EditButton from '../shared/EditButton'
import { DEFAULT_REPO_OWNER } from './common'
import { MetadataContext } from './MetadataContext'

const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-sunshine
  text-building-block hover:text-dial-sunshine
`

const MetadataViewer = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { apiMetadata } = useContext(MetadataContext)

  return (
    <div className='flex flex-col gap-1 mx-8 py-4'>
      <div className='flex flex-row'>
        <div className='mx-4 text-building-block font-semibold'>{format('govstack.api.repositories')}</div>
        <div className='ml-auto my-auto'>
          <EditButton type='link' href='building-blocks/edit' />
        </div>
      </div>
      {
        apiMetadata && Object.keys(apiMetadata['api-mappings']).map((key, index) => {
          const apiMapping = apiMetadata['api-mappings'][key]

          return (
            <Link key={index} href={`building-blocks/${apiMapping.label}`}>
              <div className={containerElementStyle}>
                <div className='py-2 bg-white border border-dial-gray hover:border-transparent shadow-md'>
                  <div className='py-4 px-4 flex text-base font-semibold'>
                    {`${DEFAULT_REPO_OWNER}/${apiMapping.label}`}
                    <AiOutlineArrowRight className='ml-auto my-auto' />
                  </div>
                </div>
              </div>
            </Link>
          )
        })
      }
    </div>
  )
}

export default MetadataViewer
