/* global IntersectionObserver: false */

import { useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import parse from 'html-react-parser'
import { Loading, Error } from '../shared/FetchStatus'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import ProductCard from '../products/ProductCard'
import PlayPreviewMove from '../plays/PlayPreviewMove'
import { PlaybookDetailDispatchContext } from './PlaybookDetailContext'

const DEFAULT_PAGE_SIZE = 10
const PLAYBOOK_PLAYS_QUERY = gql`
  query SearchPlaybookPlays($first: Int, $after: String, $slug: String!) {
    searchPlaybookPlays(first: $first, after: $after, slug: $slug) {
      __typename
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        slug
        name
        imageFile
        playDescription {
          id
          description
        }
        playMoves {
          id
          slug
          name
        }
        products {
          id
          name
          slug
          imageFile
        }
        buildingBlocks {
          id
          name
          slug
          imageFile
        }
      }
    }
  }
`

const Play = ({ play, index }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { updateSlugInformation } = useContext(PlaybookDetailDispatchContext)

  const ref = useRef()
  const [yValue, setYValue] = useState(0)
  const [height, setHeight] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [intersectionRatio, setIntersectionRatio] = useState(0)

  useEffect(() => {
    // Update context for this slug
    updateSlugInformation(play.slug, yValue, height, windowHeight, intersectionRatio)
  }, [play, yValue, height, windowHeight, intersectionRatio, updateSlugInformation])

  useEffect(() => {
    const observerCallback = ([observerData]) => {
      if (!observerData || !observerData.boundingClientRect || !observerData.rootBounds) {
        // Skip if we don't have observer data ready yet.
        return
      }

      setYValue(observerData.boundingClientRect.y)
      setHeight(observerData.boundingClientRect.height)
      setWindowHeight(observerData.rootBounds.height)
      setIntersectionRatio(observerData.intersectionRatio)
    }

    const min = 0.0
    const max = 1.0
    const items = 20
    const increments = ((max - min) / items)
    const observer = new IntersectionObserver(observerCallback, {
      threshold: [...Array(items + 1)].map((x, y) => min + increments * y),
      rootMargin: '-150px 0px 0px 0px'
    })

    observer.observe(ref.current)

    // Remove the observer as soon as the component is unmounted.
    return () => { observer.disconnect() }
  }, [])

  return (
    <div className='flex flex-col gap-4' ref={ref}>
      <div className='h-px border-b' />
      <div className='font-semibold text-2xl py-4'>
        {`${format('plays.label')} ${index + 1}. ${play.name}`}
      </div>
      <div className='fr-view tinyEditor text-dial-gray-dark'>
        {parse(play.playDescription.description)}
      </div>
      <div className='flex flex-col gap-3'>
        {
          play.playMoves.map((move, i) =>
            <PlayPreviewMove key={i} playSlug={play.slug} moveSlug={move.slug} moveName={move.name} />
          )
        }
      </div>
      {
        play.buildingBlocks && play.buildingBlocks.length > 0 &&
          <div className='flex flex-col gap-3 my-3'>
            <div className='h4'>{format('building-block.header')}</div>
            <div
              className='text-sm'
              dangerouslySetInnerHTML={{ __html: format('play.buildingBlocks.subtitle') }}
            />
            {play.buildingBlocks.map((bb, i) => <BuildingBlockCard key={i} buildingBlock={bb} listType='list' />)}
          </div>
      }
      {
        play.products && play.products.length > 0 &&
          <div className='flex flex-col gap-3 my-3'>
            <div className='h4'>{format('product.header')}</div>
            <div
              className='text-sm'
              dangerouslySetInnerHTML={{ __html: format('play.products.subtitle') }}
            />
            {play.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
          </div>
      }
    </div>
  )
}

const PlaybookDetailPlayList = ({ slug, locale }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { loading, error, data, fetchMore, refetch } = useQuery(PLAYBOOK_PLAYS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      slug: slug
    },
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        slug: slug
      }
    })
  }

  const { searchPlaybookPlays: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative px-2 py-4 max-w-catalog mx-auto'
      dataLength={nodes.length}
      next={handleLoadMore}
      scrollThreshold='60%'
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <div className='flex flex-col gap-6'>
        {nodes.map((play, i) => <Play key={i} play={play} index={i} />)}
      </div>
    </InfiniteScroll>
  )
}

export default PlaybookDetailPlayList
