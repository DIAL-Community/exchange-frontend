import Link from 'next/link'
import { useIntl } from 'react-intl'

const SectorCard = ({ sector, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <Link className='card-link' href={`/sectors/${sector.slug}`}>
      {listType === 'list'
        ? (
          <div className='border-3 border-transparent hover:border-dial-yellow text-button-gray hover:text-dial-yellow cursor-pointer'>
            <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
              <div className='flex justify-between my-4 px-4'>
                <div className='inline-block card-title truncate card-link-text'>
                  {sector.name}
                </div>
              </div>
            </div>
          </div>
          )
        : (
          <div>Card View</div>
          )}
    </Link>
  )
}

export default SectorCard