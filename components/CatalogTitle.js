import { useIntl } from 'react-intl'

const CatalogTitle = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <div className='text-center text-3xl font-bold pt-7 pb-5 text-button-gray'>
      {format('landing.title.firstLine')} {format('landing.title.secondLine')}
    </div>
  )
}

export default CatalogTitle
