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
      locale
    }
    workflows {
      name
      slug
      imageFile
    }
    products {
      name
      slug
      imageFile
    }
  }
}
`

const BuildingBlock = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(BUILDING_BLOCK_QUERY, { variables: { slug: slug }, skip: !slug })

  const discourseElement = useRef()
  const scrollToDiv = (ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth'
    })
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
        data && data.buildingBlock &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <BuildingBlockDetailLeft buildingBlock={data.buildingBlock} discourseClick={() => scrollToDiv(discourseElement)} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <BuildingBlockDetailRight buildingBlock={data.buildingBlock} discourseRef={discourseElement} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(BuildingBlock)
