import { useIntl } from 'react-intl'

const SectorCard = ({ sector, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent text-button-gray'>
              <div className='border border-dial-gray shadow-sm hover:shadow-lg'>
                <div className='flex justify-between my-4 px-4'>
                  <div className='inline-block card-title text-button-gray'>
                    {sector.name}
                  </div>
                </div>
              </div>
            </div>
            )
          : <div>{format('sector.label')}</div>
      }
    </>
  )
}

export default SectorCard
