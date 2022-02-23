import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'

import withApollo from '../../../lib/apolloClient'
import { gql, useQuery } from '@apollo/client'

import WorkflowDetailLeft from '../../../components/workflows/WorkflowDetailLeft'
import WorkflowDetailRight from '../../../components/workflows/WorkflowDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import { useEffect } from 'react'

const WORKFLOW_QUERY = gql`
  query Workflow($slug: String!) {
    workflow(slug: $slug) {
      id
      name
      slug
      imageFile
      workflowDescription {
        description
        locale
      }
      useCaseSteps {
        slug
        name
        useCase {
          slug
          name
          maturity
          imageFile
        }
      }
      buildingBlocks {
        name
        slug
        maturity
        imageFile
      }
    }
  }
`

const Workflow = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { pathname, asPath, query, locale } = useRouter()

  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(WORKFLOW_QUERY, {
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
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.workflow &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <WorkflowDetailLeft workflow={data.workflow} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <WorkflowDetailRight workflow={data.workflow} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Workflow)
