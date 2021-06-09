import { useRouter } from 'next/router'
import Head from 'next/head'

import { useRef } from 'react'
import { useIntl } from 'react-intl'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import withApollo from '../../../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import ReactTooltip from 'react-tooltip'

import ProductDetailLeft from '../../../components/products/ProductDetailLeft'
import ProductDetailRight from '../../../components/products/ProductDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'

const PRODUCT_QUERY = gql`
query Product($slug: String!) {
  product(slug: $slug) {
    id
    name
    slug
    imageFile
    website
    repository
    license
    statistics
    languageData
    owner
    codeLines
    cocomo
    tags
    discourseId
    productDescriptions {
      description
    }
    origins {
      name
      slug
    }
    endorsers {
      name
      slug
    }
    childProducts {
      name
      slug
      repository
      license
      statistics
      languageData
      productDescriptions {
        description
      }
      origins {
        name
      }
    }
    interoperatesWith {
      name
      slug
      origins {
        name
      }
    }
    includes {
      name 
      slug
      origins {
        name
      }
    }
    organizations {
      name
      slug
      isEndorser
      whenEndorsed
    }
    currProjects(first:10) {
      name
      slug
      origin {
        slug
      }
    }
    buildingBlocks {
      name
      slug
      imageFile
      maturity
    }
    sustainableDevelopmentGoals {
      id
      name
      slug
      imageFile
    }
    sectors {
      name
      slug
      isDisplayable
    }
    maturityScore
    maturityScores
  }
}
`

export async function getServerSideProps (context) {
  return {
    props: {} // will be passed to the page component as props
  }
}

const Product = () => {
  const discourseElement = useRef()

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(PRODUCT_QUERY, { variables: { slug: slug } })

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
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      {loading && <Loading />}
      {error && <Error />}
      {
        data && data.product &&
          <div className='flex justify-between'>
            <div className='relative md:sticky md:top-66px w-full md:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <ProductDetailLeft product={data.product} discourseClick={() => scrollToDiv(discourseElement)} />
            </div>
            <div className='w-full md:w-2/3 xl:w-3/4'>
              <ProductDetailRight product={data.product} discourseRef={discourseElement} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Product)
