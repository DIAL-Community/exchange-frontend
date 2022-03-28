import Head from 'next/head'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GradientBackground from '../../components/shared/GradientBackground'

const SignIn = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/products')
    }, 1000)
  }, [])

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GradientBackground />
      <Header />
      <div className='m-8'>Your account has been confirmed. You may now sign in. Redirecting...</div>
      <Footer />
    </>
  )
}

export default SignIn
