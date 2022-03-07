import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'

import withApollo from '../../../lib/apolloClient'
import { gql, useQuery } from '@apollo/client'

import UseCaseDetailLeft from '../../../components/use-cases/UseCaseDetailLeft'
import UseCaseDetailRight from '../../../components/use-cases/UseCaseDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const USE_CASE_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      id
      name
      slug
      imageFile
      useCaseDescription {
        description
        locale
      }
      sdgTargets {
        id
        name
        targetNumber
        sustainableDevelopmentGoal {
          slug
        }
      }
      workflows {
        name
        slug
        imageFile
      }
      buildingBlocks {
        name
        slug
        maturity
        imageFile
      }
      useCaseHeaders {
        header
      }
    }
  }
`

const UseCase = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { pathname, asPath, query, locale } = useRouter()

  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(USE_CASE_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    if (query.locale) {
      router.replace({ pathname }, asPath, { locale: query.locale })
    }
  })

  useEffect(() => {
    refetch()
  }, [locale])

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.useCase &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <UseCaseDetailLeft useCase={data.useCase} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <UseCaseDetailRight useCase={data.useCase} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(UseCase)
