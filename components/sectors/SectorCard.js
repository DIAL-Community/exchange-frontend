import { useIntl } from 'react-intl'

const SectorCard = ({ sector, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent'>
              <div className='border border-dial-gray card-drop-shadow'>
                <div className='flex justify-between my-5 px-4'>
                  <div className='inline-block font-semibold text-button-gray'>
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
