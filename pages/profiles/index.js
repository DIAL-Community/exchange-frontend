import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import { handleLoadingSession } from '../../components/shared/SessionQueryHandler'
import { useUser } from '../../lib/hooks'

const Profile = () => {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    const id = setTimeout(() => {
      if (!user) {
        router.push('/')
      } else {
        router.push('/profiles/me')
      }
    }, 1000)

    return () => {
      clearTimeout(id)
    }
  }, [router, user])

  return (
    <>
      <Header />
      {handleLoadingSession()}
      <Footer />
    </>
  )
}

export default Profile
