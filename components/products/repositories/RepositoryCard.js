import Link from 'next/link'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

import { convertToKey } from '../../context/FilterContext'
const productsPath = convertToKey('Products')
const repositoriesPath = convertToKey('Repositories')

const RepositoryCard = ({ productRepository, repositorySlug, listStyle }) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  // Style the card based on the list style
  const cardContainerStyles = () => {
    if (listStyle === 'compact') {
      return [
        'text-product cursor-pointer border-transparent hover:border-r-2 hover:border-dial-yellow',
        'border'
      ]
    } else {
      return [
        'text-product border-3 border-transparent hover:border-dial-yellow cursor-pointer',
        'border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'
      ]
    }
  }

  const [hoverStyle, containerStyle] = cardContainerStyles()

  return (
    <Link href={`/${productsPath}/${productRepository.product.slug}/${repositoriesPath}/${productRepository.slug}`}>
      <div className={hoverStyle}>
        <div className={containerStyle}>
          <div className='flex flex-row'>
            <div className={`py-4 ${repositorySlug && repositorySlug === productRepository.slug ? 'bg-product' : 'bg-transparent'}`} style={{ width: '4px' }}>
              &nbsp;
            </div>
            <div className='py-4 px-4 flex flex-col'>
              <div className='text-base font-semibold'>{`${productRepository.name}`}</div>
              <div className='text-sm'>{`${productRepository.absoluteUrl}`}</div>
            </div>
            <div className='bg-transparent' style={{ width: '4px' }}>
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RepositoryCard
