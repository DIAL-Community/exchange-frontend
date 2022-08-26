import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GradientBackground from '../../components/shared/GradientBackground'

const SignIn = () => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/products')
    }, 1000)
  }, [])

  return (
    <>
      <GradientBackground />
      <Header />
      <div className='m-8'>Your account has been confirmed. You may now sign in. Redirecting...</div>
      <Footer />
    </>
  )
}

export default SignIn
