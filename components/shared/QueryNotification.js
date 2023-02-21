import { useRouter } from 'next/router'
import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { QueryParamContext } from '../context/QueryParamContext'

const QueryNotification = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query } = useRouter()

  const { interactionDetected, setInteractionDetected } = useContext(QueryParamContext)

  const closeNotification = (e) => {
    e.preventDefault()
    setInteractionDetected(true)
    // If we want to remove the query parameters
    // router.push(router.pathname)
  }

  return (
    <>
      {
        query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected &&
          <div className='z-100 bg-black fixed top-0 left-0 w-full h-full bg-opacity-60'>
            <div className='w-full h-full flex flex-col justify-center items-center'>
              <div className='text-white'>{format('overlay.message')}</div>
              <a
                className='rounded text-white bg-blue-500 px-4 py-3 my-4 text-lg shadow-xl'
                href='/dismiss-notification-overlay'
                onClick={closeNotification}
              >
                {format('overlay.close')}
              </a>
            </div>
          </div>
      }
    </>
  )
}

export default QueryNotification
