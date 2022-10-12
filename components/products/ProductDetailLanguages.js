import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const ProductDetailLanguages = ({ languages }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const totalSize = languages?.map(language => language?.size).reduce((previousSize, nextSize) => previousSize + nextSize)

  const legends = languages?.map(({ size, node: { name, color } }) => ({ name, color, percentage: size / totalSize * 100 }))

  return (
    languages && (
      <div className='mb-2'>
        <div className='text-sm font-semibold my-2'>
          {format('product.languages')}
        </div>
        <div className='mb-2'>
          <div className='progress flex'>
            {legends?.map(({ color, percentage }, legendIdx) => {
              const styles = {
                width: `${percentage}%`,
                backgroundColor: color
              }

              return <div key={legendIdx} className='repository-progress-padding' style={styles} />
            })}
          </div>
        </div>
        <div className='grid sm:grid-cols-2 xl:flex xl:justify-between '>
          {legends.map(({ color, percentage, name }, legendIdx) => (
            <div key={legendIdx} className='inline'>
              <svg className='inline' fill={color} xmlns='http://www.w3.org/2000/svg' version='1.1' width='16' height='16' aria-hidden='true'>
                <path d='M8 4a4 4 0 100 8 4 4 0 000-8z' />
              </svg>
              <span className='text-gray-dark text-sm mx-2'>{name}</span>
              <span>{percentage.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  )
}

export default ProductDetailLanguages
