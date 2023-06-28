import { useRouter } from 'next/router'
import { useEffect } from 'react'

const StorefrontProjects = () => {
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    router.push(`/${router.locale}/storefronts/${slug}`)
  }, [router, slug])
}

export default StorefrontProjects
