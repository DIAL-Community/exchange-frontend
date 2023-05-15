import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const RepositoryInfo = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const currVersion = (
    product.statistics.data &&
    product.statistics.data.repository &&
    product.statistics.data.repository.releases &&
    product.statistics.data.repository.releases.edges[0])
    ? product.statistics.data.repository.releases.edges[0].node.name
    : null

  return (
    <>
      <div className='pb-5 pr-5 text-ellipsis overflow-hidden'>
        <div className='h5 pb-1'>{format('product.website')}</div>
        <a
          className='text-dial-blue text-sm'
          href={`//${product.website}`}
          target='_blank'
          rel='noreferrer'
        >
          {product.website}
        </a>
      </div>
      <div className='pb-5 pr-5 text-ellipsis overflow-hidden'>
        <div className='h5 pb-1'>{format('product.repository')}</div>
        <a
          className='text-dial-blue text-sm'
          href={`${product.repository}`}
          target='_blank'
          rel='noreferrer'
        >
          {product.repository}
        </a>
      </div>
      <div className='pb-5 pr-5 grid grid-cols-2'>
        <div>
          <div className='h5 pb-1'>{format('product.current-version')}</div>
          <div className='text-sm'>{currVersion || format('product.no-version-data')}</div>
        </div>
        <div>
          <div className='h5 pb-1'>{format('product.license')}</div>
          <div className='text-sm'>{product.license}</div>
        </div>
      </div>
    </>
  )
}

export default RepositoryInfo
