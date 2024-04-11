import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useActiveTenant } from './hooks'

export default function ClientOnly ({ clientTenants, children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false)

  const { waitingActiveTenant, tenant } = useActiveTenant()

  const router = useRouter()

  useEffect(() => {
    console.log('Waiting for tenant information ...')
    if (waitingActiveTenant || typeof tenant === 'undefined') {
      return
    }

    console.log('Received current tenant information: "%s".', tenant)
    const tenantHaveAccess = typeof clientTenants !== 'undefined' && clientTenants.includes(tenant)

    console.log('Client tenant: %s, tenant: %s.', clientTenants, tenant)
    if (tenantHaveAccess) {
      setHasMounted(true)
    } else {
      router.push('/')
    }
  }, [children, clientTenants, waitingActiveTenant, tenant, router])

  if (!hasMounted) {
    return null
  }

  return <div className='max-w-catalog mx-auto' {...delegated}>{children}</div>
}
