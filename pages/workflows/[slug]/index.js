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
  const { loading, error, data } = useQuery(WORKFLOW_QUERY, { variables: { slug: slug } })

  if (loading) {
    return (
      <>
        <Header />
        <div className='relative text-center my-3'>{format('general.fetchingData')}</div>
      </>
    )
  }
  if (error) {
    return (
      <>
        <Header />
        <div className='relative text-center my-3 default-height'>{format('general.fetchError')}</div>
      </>
    )
  }

  const workflow = data.workflow
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='w-full h-full flex flex-col md:flex-row p-6 page-gradient'>
        <div className='w-full xl:w-1/4 md:w-1/3 pt-4'>
          <WorkflowDetailLeft workflow={workflow} />
        </div>
        <div className='w-full xl:w-3/4 md:w-2/3 pt-4 h-screen overflow-y-scroll'>
          <WorkflowDetailRight workflow={workflow} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(Workflow)
