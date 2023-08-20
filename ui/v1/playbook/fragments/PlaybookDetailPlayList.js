import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FiMove } from 'react-icons/fi'
import { useUser } from '../../../../lib/hooks'
import { PlaybookDetailDispatchContext } from '../context/PlaybookDetailContext'
import EditButton from '../../shared/form/EditButton'
import UnassignPlay from '../../play/UnassignPlay'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import CreateButton from '../../shared/form/CreateButton'
import PlayPreviewMove from '../../play/PlayPreviewMove'
import RearrangeMoves from '../../move/RearrangeMoves'
import BuildingBlockCard from '../../building-block/BuildingBlockCard'
import { DisplayType } from '../../utils/constants'
import ProductCard from '../../product/ProductCard'
import { PLAYBOOK_PLAYS_QUERY } from '../../shared/query/playbook'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 10

const Play = ({ playbookSlug, play, index }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  const { user } = useUser()
  const canEdit = user?.isAdminUser || user?.isEditorUser

  const { updateSlugInformation, setWindowHeight } = useContext(PlaybookDetailDispatchContext)

  const ref = useRef()
  const [yValue, setYValue] = useState(0)
  const [height, setHeight] = useState(0)

  const [displayDragable, setDisplayDragable] = useState(false)
  const onDragableClose = () => {
    setDisplayDragable(false)
  }

  useEffect(() => {
    // Update context for this slug
    setWindowHeight(window.innerHeight)
    updateSlugInformation(play.slug, yValue, height)
  }, [play, yValue, height])

  const generateEditLink = () => {
    if (!canEdit) {
      return '/edit-not-available'
    }

    return `/${locale}/playbooks/${playbookSlug}/plays/${play.slug}/edit`
  }

  const generateAddMoveLink = () => {
    if (!canEdit) {
      return '/add-move-not-available'
    }

    return `/${locale}/playbooks/${playbookSlug}/plays/${play.slug}/moves/create`
  }

  useEffect(() => {
    // Update scrolling state information based on the observer data.
    if (!ref.current) {
      return
    }

    const onScroll = () => {
      if (!ref.current) {
        return
      }

      const boundingClientRect = ref.current.getBoundingClientRect()
      setYValue(boundingClientRect.y)
      setHeight(boundingClientRect.height)
    }

    window.addEventListener('scroll', onScroll)

    // Remove the observer as soon as the component is unmounted.
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref])

  return (
    <div className='flex flex-col gap-4' ref={ref}>
      <div className='h-px border-b' />
      <div className='flex'>
        <div className='font-semibold text-2xl py-4'>
          {`${format('ui.play.label')} ${index + 1}. ${play.name}`}
        </div>
        <div className='ml-auto my-auto flex gap-2'>
          {canEdit && <EditButton type='link' href={generateEditLink()} />}
          {canEdit && <UnassignPlay playbookSlug={playbookSlug} playSlug={play.slug} />}
        </div>
      </div>
      <HtmlViewer
        initialContent={play?.playDescription?.description}
        editorId={`play-${index}-desc`}
        className='-mt-4'
      />
      <div className='flex flex-col gap-3'>
        <div className='flex gap-2 ml-auto'>
          {canEdit &&
            <CreateButton
              label={format('ui.move.add')}
              type='link'
              href={generateAddMoveLink()}
            />
          }
          {canEdit && play.playMoves.length > 0 &&
            <button
              type='button'
              onClick={() => setDisplayDragable(!displayDragable)}
              className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-white'
            >
              <FiMove className='inline pb-0.5' />
              <span className='text-sm px-1'>
                {format('ui.move.rearrange')}
              </span>
            </button>
          }
        </div>
        {
          play.playMoves.map((move, i) =>
            <div key={i}>
              <PlayPreviewMove
                playSlug={play.slug}
                moveSlug={move.slug}
                moveName={move.name}
                playbookSlug={playbookSlug}
              />
              <RearrangeMoves
                play={play}
                displayDragable={displayDragable}
                onDragableClose={onDragableClose}
              />
            </div>
          )
        }
      </div>
      {
        play.buildingBlocks && play.buildingBlocks.length > 0 &&
          <div className='flex flex-col gap-3 my-3'>
            <div className='h4'>{format('ui.buildingBlock.header')}</div>
            <div
              className='text-sm'
              dangerouslySetInnerHTML={{ __html: format('ui.play.buildingBlocks.subtitle') }}
            />
            <div className='grid grid-cols-1 md:grid-cols-2'>
              {play.buildingBlocks.map((bb, bbIdx) =>
                <BuildingBlockCard key={`play-bb-${bbIdx}`} buildingBlock={bb} displayType={DisplayType.SM} />)
              }
            </div>
          </div>
      }
      {
        play.products && play.products.length > 0 &&
          <div className='flex flex-col gap-3 my-3'>
            <div className='h4'>{format('ui.product.header')}</div>
            <div
              className='text-sm'
              dangerouslySetInnerHTML={{ __html: format('ui.play.products.subtitle') }}
            />
            <div className='grid grid-cols-1 md:grid-cols-2'>
              {play.products.map(
                (product, productIdx) =>
                  <ProductCard key={`play-product-${productIdx}`} product={product} displayType={DisplayType.SMALL_CARD} />
              )}
            </div>
          </div>
      }
    </div>
  )
}

const PlaybookDetailPlayList = ({ slug, locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data, fetchMore, refetch } = useQuery(PLAYBOOK_PLAYS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      slug
    },
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        slug
      }
    })
  }

  // Loading and error handler section.
  if (loading) {
    return <Loading />
  } else if (error) {
    if (error.networkError) {
      return <Error />
    } else {
      return <NotFound />
    }
  }

  const { searchPlaybookPlays: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative px-2 py-4'
      dataLength={nodes.length}
      next={handleLoadMore}
      scrollThreshold='60%'
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <div className='flex flex-col gap-6'>
        {nodes.map((play, i) =>
          <Play key={`play-list-${i + 1}`} playbookSlug={slug} play={play} index={i} />
        )}
      </div>
    </InfiniteScroll>
  )
}

export default PlaybookDetailPlayList