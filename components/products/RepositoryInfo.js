import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { useEffect } from 'react'

const RepositoryInfo = ({product}) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const currVersion = (product.statistics.data && product.statistics.data.repository && product.statistics.data.repository.releases && product.statistics.data.repository.releases.edges[0]) ? product.statistics.data.repository.releases.edges[0].node.name : null
  
  return (
  <>
    <div className='pb-5 pr-5 overflow-ellipsis overflow-hidden'>
      <div className='h5 pb-1'>{format('product.website')}</div>
      <a className='text-dial-blue text-sm' href={`https://${product.website}`} target='_blank'>{product.website}</a>
    </div>
    <div className='pb-5 pr-5 overflow-ellipsis overflow-hidden'>
      <div className='h5 pb-1'>{format('product.repository')}</div>
      <a className='text-dial-blue text-sm' href={`https://${product.repository}`} target='_blank'>{product.repository}</a>
    </div>
    <div className='pb-5 pr-5 grid grid-cols-2'>
      <div>
        <div className='h5 pb-1'>{format('product.current-version')}</div>
        <div className='text-sm'>{currVersion ? currVersion : format('product.no-version-data')}</div>
      </div>
      <div>
        <div className='h5 pb-1'>{format('product.license')}</div>
        <div className='text-sm'>{product.license}</div>
      </div>
    </div>
    <div className='pb-5 pr-5'>
      <div className='h5 pb-1'>{format('product.source')}</div>
      {product.origins.map((origin, i) => {
        return (<div>
          <img src={'/images/origins/'+origin.slug+'.png'} height='20px' width='20px' className='inline' />
          <div key={i} className='inline ml-2 text-sm'>{origin.name}</div>
          </div>)
      })}
    </div>
    <div className='pb-5 pr-5'>
      <div className='h5 pb-1'>{format('product.endorsers')}</div>
      {product.endorsers && product.endorsers.map((endorser, i) => {
        return (<div>
          <img data-tip={format('product.endorsed-by')} src={'/images/origins/'+endorser.slug+'.png'} height='20px' width='20px' className='inline' />
          <div key={i} data-tip={format('product.endorsed-by') + endorser.name} className='text-sm inline ml-2'>{endorser.name}</div>
          </div>
          )
      })}
    </div>
  </>
  )
}

export default RepositoryInfo
