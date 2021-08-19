import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GradientBackground from '../../components/shared/GradientBackground'


const SignIn = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GradientBackground />
      <Header />
      <div className='m-8'>Your account has been confirmed. You may now sign in.</div>
      <Footer />
    </>
  )
}

export default SignIn
