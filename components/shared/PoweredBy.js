import { useIntl } from 'react-intl'

const PoweredBy = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <a href='https://solutions.dial.community' target='_blank' rel='noreferrer'>
      <span className='text-dial-yellow h5 pt-5'>{format('app.powered')}</span>
    </a>
  )
}

export default PoweredBy
