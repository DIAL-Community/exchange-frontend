import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import Header from '../../components/Header'
import Definition from '../../components/Definition'
import Footer from '../../components/Footer'
import Carousel from '../../components/Carousel'

const AboutPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('header.about')}
        description={format('seo.description.about')}
      />
      <Header/>
      <Definition/>
      <Carousel/>
      <Footer/>
    </>
  )
}

export default AboutPage
