import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa6'

const QueryNotification = () => {
  const { query } = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      {query?.shareCatalog && Object.getOwnPropertyNames(query).length > 1 && loading &&
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <FaSpinner size='3em' className='spinner mx-auto' />
        </div>
      }
    </>
  )
}

export default QueryNotification
