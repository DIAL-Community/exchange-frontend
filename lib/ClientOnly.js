import { useEffect, useState } from 'react'

export default function ClientOnly ({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <div className='max-w-catalog mx-auto' {...delegated}>{children}</div>
}
