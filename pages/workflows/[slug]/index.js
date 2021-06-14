import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import withApollo from '../../../lib/apolloClient'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import WorkflowDetailLeft from '../../../components/workflows/WorkflowDetailLeft'
import WorkflowDetailRight from '../../../components/workflows/WorkflowDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'

const WORKFLOW_QUERY = gql`
  query Workflow($slug: String!) {
    workflow(slug: $slug) {
      id
      name
      slug
      imageFile
      workflowDescriptions {
        description
      }
      useCaseSteps {
        slug
        name
        useCase {
          slug
          name
          maturity
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
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(WORKFLOW_QUERY, { variables: { slug: slug }, skip: !slug })

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    )
  }
  if (error) {
    return (
      <>
        <Header />
        <Error />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {loading && <Loading />}
      {error && <Error />}
      {
        data && data.workflow &&
          <div className='flex justify-between'>
            <div className='relative md:sticky md:top-66px w-full md:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <WorkflowDetailLeft workflow={data.workflow} />
            </div>
            <div className='w-full md:w-2/3 xl:w-3/4'>
              <WorkflowDetailRight workflow={data.workflow} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Workflow)
