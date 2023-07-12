import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl, FormattedDate } from 'react-intl'
import { FaStar, FaCalendar, FaCalendarAlt } from 'react-icons/fa'
import { convertToKey } from '../../context/FilterContext'
const productsPath = convertToKey('Products')
const repositoriesPath = convertToKey('Repositories')

const RepositoryCard = ({ productRepository, repositorySlug, listStyle }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  // Style the card based on the list style
  const cardContainerStyles = () => {
    if (listStyle === 'compact') {
      return [
        'text-product cursor-pointer border-transparent hover:border-r-2 hover:border-dial-sunshine',
        'border'
      ]
    } else {
      return [
        'text-product border-3 border-transparent hover:border-dial-sunshine cursor-pointer',
        'border border-dial-gray hover:border-transparent shadow-md'
      ]
    }
  }

  const [hoverStyle, containerStyle] = cardContainerStyles()

  return (
    <Link
      href={
        `/${productsPath}/${productRepository.product.slug}` +
        `/${repositoriesPath}/${productRepository.slug}`
      }
    >
      <div className={hoverStyle}>
        <div className={containerStyle}>
          <div className='flex flex-row justify-between'>
            <div className='flex justify-self-start'>
              <div
                className={`
                  py-4
                  ${
                    repositorySlug && repositorySlug === productRepository.slug
                      ? 'bg-product'
                      : 'bg-transparent'
                  }
                `}
                style={{ width: '4px' }}
              >
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
            {listStyle !== 'compact' && (
              <div className='w-1/2 grid grid-cols-3 text-sm py-3'>
                <div className='pb-4'>
                  <div><FaStar className='inline mr-2' />{format('product.star')}</div>
                  <div>
                    {
                      productRepository.statisticalData.data
                        ? productRepository.statisticalData.data.repository?.stargazers.totalCount
                        : format('general.na')
                    }
                  </div>
                </div>
                <div className='pb-4'>
                  <div><FaCalendar className='inline mr-2' />{format('product.created')}</div>
                  <div>
                    {
                      productRepository.statisticalData.data
                        ? <FormattedDate
                          value={new Date(productRepository.statisticalData.data.repository?.createdAt)}
                          year='numeric' month='long' day='2-digit'
                        />
                        : format('general.na')
                    }
                  </div>
                </div>
                <div className='pb-4'>
                  <div><FaCalendarAlt className='inline mr-2' />{format('product.last-updated')}</div>
                  <div>
                    {
                      productRepository.statisticalData.data
                        ? <FormattedDate
                          value={new Date(productRepository.statisticalData.data?.repository?.updatedAt)}
                          year='numeric' month='long' day='2-digit'
                        />
                        : format('general.na')
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RepositoryCard
