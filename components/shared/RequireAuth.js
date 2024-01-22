import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const RequireAuth = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  return (
    <div className='flex h-[20vh] justify-center items-center'>
      <div className='my-auto'>
        {format('app.loginRequired')}
      </div>
    </div>
  )
}

export default RequireAuth
