import { gql, useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import DatasetDetailLeft from './DatasetDetailLeft'
import DatasetDetailRight from './DatasetDetailRight'

const DATASET_QUERY = gql`
  query Dataset($slug: String!) {
    dataset(slug: $slug) {
      id
      name
      slug
      imageFile
      website
      visualizationUrl
      geographicCoverage
      timeRange
      license
      languages
      datasetType
      dataFormat
      tags
      datasetDescription {
        description
        locale
      }
      origins {
        name
        slug
      }
      organizations {
        name
        slug
        imageFile
        isEndorser
        whenEndorsed
      }
      sustainableDevelopmentGoalMapping
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
      countries {
        name
      }
      manualUpdate
    }
  }
`

const DatasetDetail = ({ slug, locale }) => {
  const discourseElement = useRef()

  const { loading, error, data, refetch } = useQuery(DATASET_QUERY, {
    variables: { slug },
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
        data && data.dataset &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <DatasetDetailLeft dataset={data.dataset} discourseClick={() => scrollToDiv(discourseElement)} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <DatasetDetailRight dataset={data.dataset} discourseRef={discourseElement} />
            </div>
          </div>
      }
    </>
  )
}

export default DatasetDetail
