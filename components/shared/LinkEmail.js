import { useState, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'

function obfuscateEmail(email) {
  return email?.split('').map(char => `&#${char.charCodeAt(0)};`).join('')
}

export default function EmailLink({ product }) {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [decodedEmail, setDecodedEmail] = useState('')

  useEffect(() => {
    if (product?.contact) {
      setDecodedEmail(product.contact)
    }
  }, [product])

  const obfuscatedEmail = obfuscateEmail(product?.contact)

  return (
    product?.contact ?
      <a
        href={`mailto:${decodedEmail}`}
        dangerouslySetInnerHTML={{ __html: obfuscatedEmail }}
        className='flex border-b border-dial-iris-blue line-clamp-1 break-all'
        onClick={(e) => {
          if (!decodedEmail) {
            e.preventDefault()
          }
        }}
      />
      : format('general.na').toUpperCase()
  )
}
