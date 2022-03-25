import { useState } from 'react'
import { useIntl } from 'react-intl'

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
          value: value,
          label: label
        })
      })
    } else {
      const [value, label] = query[fieldName].split('--')
      contextValues.push({
        value: value,
        label: label
      })
    }

    contextSetter(contextValues)
  }
}

const SharableLink = ({ sharableLink }) => {
  const [shareStatus, setShareStatus] = useState('')

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
            {
              shareStatus === 'success'
                ? <div className='text-emerald-500'>{format('app.shareSuccess')}</div>
                : shareStatus === 'failed' && <div className='text-red-500'>{format('app.shareFailed')}</div>
            }
          </div>
      }
    </>
  )
}

export default SharableLink
