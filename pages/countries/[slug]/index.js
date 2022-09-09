import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import CountryDetail from '../../../components/countries/CountryDetail'
import NotFound from '../../../components/shared/NotFound'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import { COUNTRY_DETAIL_QUERY } from '../../../queries/country'
import { useUser } from '../../../lib/hooks'

const CountryPageDefinition = ({ slug, locale }) => {
  const { loading, error, data } = useQuery(COUNTRY_DETAIL_QUERY, {
    variables: { slug },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return data?.country && <CountryDetail country={data.country} />
}

const Country = () => {
  const router = useRouter()

  const { isAdminUser, loadingUserSession } = useUser()

  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession ?
          <Loading /> :
          isAdminUser ?
            <CountryPageDefinition slug={slug} locale={locale} /> :
            <Unauthorized />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Country
