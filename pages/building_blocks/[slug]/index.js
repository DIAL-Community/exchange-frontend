import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import withApollo from '../../../lib/apolloClient'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import BuildingBlockDetailLeft from '../../../components/building-blocks/BuildingBlockDetailLeft'
import BuildingBlockDetailRight from '../../../components/building-blocks/BuildingBlockDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'

const BUILDING_BLOCK_QUERY = gql`
query BuildingBlock($slug: String!) {
  buildingBlock(slug: $slug) {
    id
    name
    slug
    imageFile
    discourseId
    buildingBlockDescriptions {
      description
    }
    workflows {
      name
      slug
    }
    products {
      name
      slug
    }
  }
}
`

const BuildingBlock = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(BUILDING_BLOCK_QUERY, { variables: { slug: slug } })

  const scrollToDiv = (ref) => {
    rightPanel.current.scrollTo({
      top: ref.current.offsetTop - 100,
      behavior: 'smooth'
    })
  }
  const discourseElement = useRef()
  const rightPanel = useRef()

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

  const buildingBlock = data.buildingBlock
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='w-full h-full flex flex-col md:flex-row p-6 page-gradient'>
        <div className='w-full xl:w-1/4 md:w-1/3 pt-4'>
          <BuildingBlockDetailLeft buildingBlock={buildingBlock} discourseClick={()=> scrollToDiv(discourseElement)} />
        </div>
        <div className='w-full xl:w-3/4 md:w-2/3 pt-4 h-screen overflow-y-scroll' ref={rightPanel}>
          <BuildingBlockDetailRight buildingBlock={buildingBlock} discourseRef={discourseElement} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(BuildingBlock)