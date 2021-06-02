import { useRouter } from 'next/router'
import Head from 'next/head'

import { useRef } from 'react'
import { useIntl } from 'react-intl'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import withApollo from '../../../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

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
    discourseId
    productDescriptions {
      description
    }
    origins {
      name
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
  const rightPanel = useRef()

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(PRODUCT_QUERY, { variables: { slug: slug } })

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    )
  }
  if (error) {
    return (
      <>
        <Header />
        <Error />
        <Footer />
      </>
    )
  }

  const scrollToDiv = (ref) => {
    rightPanel.current.scrollTo({
      top: ref.current.offsetTop - 100,
      behavior: 'smooth'
    })
  }

  const product = data.product
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='w-full h-full flex flex-col md:flex-row p-6 page-gradient'>
        <div className='w-full xl:w-1/4 md:w-1/3 pt-4'>
          <ProductDetailLeft product={product} discourseClick={()=> scrollToDiv(discourseElement)} />
        </div>
        <div className='w-full xl:w-3/4 md:w-2/3 pt-4 h-screen overflow-y-scroll'>
          <ProductDetailRight product={product} discourseRef={discourseElement} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(Product)
