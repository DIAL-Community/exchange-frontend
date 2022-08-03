import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'

const isArray = (o) => {
  return Object.prototype.toString.call(o) === '[object Array]'
}

export const parseQuery = (query, fieldName, contextValues, contextSetter) => {
  if (query[fieldName]) {
    contextValues.length = 0
    if (isArray(query[fieldName])) {
      query[fieldName].forEach(entry => {
        const [value, label] = entry.split('--')
        contextValues.push({
          value,
          label
        })
      })
    } else {
      const [value, label] = query[fieldName].split('--')
      contextValues.push({
        value,
        label
      })
    }

    contextSetter(contextValues)
  }
}

const SharableLink = ({ sharableLink }) => {
  const [shareStatus, setShareStatus] = useState('')

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { showToast } = useContext(ToastContext)

  const isFunction = (maybeFunc) => {
    return maybeFunc && {}.toString.call(maybeFunc) === '[object Function]'
  }

  const copyToClipboard = (e) => {
    e.preventDefault()
    if (navigator.clipboard && sharableLink && isFunction(sharableLink)) {
      navigator.clipboard.writeText(sharableLink())
        .then(() => {
          setShareStatus('success')
          setTimeout(() => setShareStatus(''), 4000)
        }, () => {
          setShareStatus('failed')
        })
    }
  }

  useEffect(() => {
    if (shareStatus === 'success') {
      showToast(format('app.shareSuccess'), 'success', 'top-center', 2000)
    } else if (shareStatus === 'failed') {
      showToast(format('app.shareFailed'), 'error', 'top-center', 2000)
    }
  }, [shareStatus])

  return (
    <>
      {
        navigator.clipboard &&
          <div className='opacity-50'>
            <a
              href='/generate-sharable-link' onClick={copyToClipboard}
              className='border-b-2 border-transparent hover:border-dial-yellow my-auto'
            >
              {format('app.shareLink')}
            </a>
          </div>
      }
    </>
  )
}

export default SharableLink
