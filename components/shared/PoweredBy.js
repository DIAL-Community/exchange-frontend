import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const PoweredBy = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <a href='https://exchange.dial.global' target='_blank' rel='noreferrer'>
      <span className='text-dial-sunshine h5 pt-5'>{format('app.powered')}</span>
    </a>
  )
}

export default PoweredBy
