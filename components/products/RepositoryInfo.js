import { useIntl } from 'react-intl'

const RepositoryInfo = ({product}) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const currVersion = (product.statistics.data && product.statistics.data.repository && product.statistics.data.repository.releases && product.statistics.data.repository.releases.edges[0]) ? product.statistics.data.repository.releases.edges[0].node.name : null
  
  return (
  <>
    <div className='pb-5'>
      <div className='h5 pb-1'>{format('product.website')}</div>
      <a className='text-dial-blue text-sm' href={`https://${product.website}`} target='_blank'>{product.website}</a>
    </div>
    <div className='pb-5'>
      <div className='h5 pb-1'>{format('product.repository')}</div>
      <a className='text-dial-blue text-sm' href={`https://${product.repository}`} target='_blank'>{product.repository}</a>
    </div>
    <div className='pb-5 grid grid-cols-2'>
      <div>
        <div className='h5 pb-1'>{format('product.current-version')}</div>
        <div className='text-sm'>{currVersion ? currVersion : format('product.no-version-data')}</div>
      </div>
      <div>
        <div className='h5 pb-1'>{format('product.license')}</div>
        <div className='text-sm'>{product.license}</div>
      </div>
    </div>
    <div className='pb-5'>
      <div className='h5 pb-1'>{format('product.source')}</div>
      {product.origins.map((origin) => {
        return (<div className='text-sm'>{origin.name}</div>)
      })}
    </div>
  </>
  )
}

export default RepositoryInfo
