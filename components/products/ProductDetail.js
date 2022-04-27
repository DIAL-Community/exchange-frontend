import { gql, useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import ProductDetailLeft from './ProductDetailLeft'
import ProductDetailRight from './ProductDetailRight'

const PRODUCT_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      imageFile
      website
      owner
      tags
      discourseId
      productDescription {
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
      currentProjects(first:10) {
        name
        slug
        origin {
          name
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
      manualUpdate
    }
  }
`

const ProductDetail = ({ slug, locale }) => {
  const discourseElement = useRef()

  const { loading, error, data, refetch } = useQuery(PRODUCT_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  const scrollToDiv = (ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
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
    </>
  )
}

export default ProductDetail
