import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useActiveTenant } from './hooks'

export default function ClientOnly ({ clientTenant, children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false)

  const { waitingActiveTenant, tenant } = useActiveTenant()

  const router = useRouter()

  useEffect(() => {
    console.log('Waiting for tenant information ...')
    if (waitingActiveTenant || typeof tenant === 'undefined') {
      return
    }

    console.log('Received current tenant information: "%s".', tenant)

    const tenantHaveAccess = typeof clientTenant !== 'undefined' && clientTenant === tenant

    console.log('Client tenant: %s, tenant: %s.', clientTenant, tenant)
    if (tenantHaveAccess) {
      setHasMounted(true)
    } else {
      router.push('/')
    }
  }, [children, clientTenant, waitingActiveTenant, tenant, router])

  if (!hasMounted) {
    return null
  }

  return <div className='max-w-catalog mx-auto' {...delegated}>{children}</div>
}
