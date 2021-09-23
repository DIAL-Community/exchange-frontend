import { useRouter } from 'next/router'
import Head from 'next/head'

import { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import withApollo from '../../../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import ProductDetailLeft from '../../../components/products/ProductDetailLeft'
import ProductDetailRight from '../../../components/products/ProductDetailRight'

import dynamic from 'next/dynamic'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const Loading = dynamic(() => import('../../../components/shared/FetchStatus').then(x => x.Loading), { ssr: false })
const Error = dynamic(() => import('../../../components/shared/FetchStatus').then(x => x.Error), { ssr: false })

const PRODUCT_QUERY = gql`
query Product($slug: String!, $locale: String!) {
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
      locale
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
        locale
      }
      origins {
        name
      }
    }
    interoperatesWith {
      name
      slug
      imageFile
      origins {
        name
      }
    }
    includes {
      name 
      slug
      imageFile
      origins {
        name
      }
    }
    organizations {
      name
      slug
      imageFile
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
    sectorsWithLocale(locale: $locale) {
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
  const { locale, pathname, asPath, query } = useRouter()

  const { slug } = router.query
  const { loading, error, data } = useQuery(PRODUCT_QUERY, { variables: { slug: slug, locale: locale }, skip: !slug })

  const scrollToDiv = (ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth'
    })
  }
  
  useEffect(() => {
    if (query.locale) {
      router.replace({ pathname }, asPath, { locale: query.locale })
    }
  })

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
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <ProductDetailLeft product={data.product} discourseClick={() => scrollToDiv(discourseElement)} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <ProductDetailRight product={data.product} discourseRef={discourseElement} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Product)
