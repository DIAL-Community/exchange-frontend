import { useEffect, useRef } from 'react'
import { gql, useQuery } from '@apollo/client'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import BuildingBlockDetailLeft from './BuildingBlockDetailLeft'
import BuildingBlockDetailRight from './BuildingBlockDetailRight'

const BUILDING_BLOCK_QUERY = gql`
  query BuildingBlock($slug: String!) {
    buildingBlock(slug: $slug) {
      id
      name
      slug
      imageFile
      discourseId
      specUrl
      buildingBlockDescription {
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

const BuildingBlockDetail = ({ slug, locale }) => {
  const { loading, error, data, refetch } = useQuery(BUILDING_BLOCK_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  const discourseElement = useRef()
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
        data && data.buildingBlock &&
          <div className='flex flex-col lg:flex-row pb-8 max-w-catalog mx-auto max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <BuildingBlockDetailLeft
                buildingBlock={data.buildingBlock}
                discourseClick={() => scrollToDiv(discourseElement)}
              />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <BuildingBlockDetailRight
                buildingBlock={data.buildingBlock}
                discourseRef={discourseElement}
              />
            </div>
          </div>
      }
    </>
  )
}

export default BuildingBlockDetail
