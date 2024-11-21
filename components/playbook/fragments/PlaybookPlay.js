import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { FaCommentAlt } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa6'
import { FiEdit3, FiMove } from 'react-icons/fi'
import { HiExternalLink } from 'react-icons/hi'
import { useInView } from 'react-intersection-observer'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import CreateButton from '../../shared/form/CreateButton'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { COMMENTS_COUNT_QUERY } from '../../shared/query/comment'
import { MOVE_PREVIEW_QUERY, PLAY_QUERY } from '../../shared/query/play'
import { ObjectType } from '../../utils/constants'
import { prependUrlWithProtocol } from '../../utils/utilities'
import RearrangePlayMoves from '../forms/RearrangePlayMoves'
import { PlaybookContext } from './PlaybookContext'
import UnassignPlay from './UnassignPlay'
import UnassignMove from './UnassignMove'

const PlayMove = ({ playMoveName, moveSlug, playSlug, playbookSlug, expanded = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [openingDetail, setOpeningDetail] = useState(expanded)

  const { user } = useUser()
  const allowedToEdit = () => user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser

  const toggleDetail = () => {
    setOpeningDetail(!openingDetail)
    loadDetailData()
  }

  const { locale } = useRouter()

  const [loadDetailData, { data, called, loading }] = useLazyQuery(MOVE_PREVIEW_QUERY, {
    variables: { playSlug, slug: moveSlug },
    context: { headers: { 'Accept-Language': locale } }
  })

  const generateEditLink = () => {
    return '' +
      `/playbooks/${playbookSlug}` +
      `/plays/${playSlug}` +
      `/moves/${moveSlug}` +
      '/edit'
  }

  return (
    <div className='flex flex-col border border-dial-orange-light'>
      <div className='collapse-header'>
        <div className='collapse-animation-base bg-dial-blue-chalk h-14' />
        <div
          className={classNames(
            'animated-collapse',
            openingDetail ? 'header-expanded' : 'header-collapsed',
            'collapse-animation bg-dial-orange-light h-14'
          )}
        />
        <div className='flex flex-row flex-wrap gap-3 collapse-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleDetail}>
            <div className='font-semibold px-4 py-4'>
              {playMoveName}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2 pb-3 lg:pb-0'>
              {allowedToEdit() &&
                <a
                  href={generateEditLink()}
                  className='cursor-pointer bg-white px-2 py-0.5 rounded'
                >
                  <FiEdit3 className='inline pb-0.5' />
                  <span className='text-sm px-1'>
                    <FormattedMessage id='app.edit' />
                  </span>
                </a>
              }
              {allowedToEdit() &&
                <UnassignMove
                  playbookSlug={playbookSlug}
                  playSlug={playSlug}
                  moveSlug={moveSlug}
                />
              }
              <button
                type='button'
                onClick={toggleDetail}
                className='cursor-pointer bg-white px-2 py-1.5 rounded'
              >
                {openingDetail
                  ? <BsChevronUp className='cursor-pointer p-01 text-dial-stratos'/>
                  : <BsChevronDown className='cursor-pointer p-0.5 text-dial-stratos'/>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`move-body ${openingDetail ? 'slide-down' : 'slide-up'}`}>
        <div className='px-4 py-4'>
          { called && loading && format('general.loadingData') }
          { data &&
            <div>
              <HtmlViewer initialContent={data.move?.moveDescription?.description} />
              {data?.move?.resources && data?.move?.resources.length > 0 &&
                <div className='text-sm'>
                  <div className='font-semibold py-2'>{format('ui.move.resources.header')}</div>
                  <div className='flex flex-wrap gap-3'>
                    {data?.move?.resources
                      .filter(resource => resource.name && resource.slug)
                      .map(resource => (
                        <Link
                          key={resource.id}
                          href={`/resources/${resource.slug}`}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <div className='group border border-gray-300 hover:border-dial-sunshine shadow-md'>
                            <div className='flex gap-3 px-3'>
                              <div className='flex flex-col gap-2 px-3 py-4'>
                                <div className='font-semibold'>{resource.name}</div>
                              </div>
                              <FaArrowRight className='my-auto shrink-0' />
                            </div>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                </div>
              }
              {data?.move?.inlineResources && data?.move?.inlineResources.length > 0 &&
                <div className='text-sm'>
                  <div className='font-semibold py-2'>{format('ui.move.resources.header')}</div>
                  <div className='flex flex-wrap gap-3'>
                    {data?.move?.inlineResources
                      .filter(resource => resource.url && resource.name)
                      .map(resource => (
                        <a
                          key={resource.i}
                          href={prependUrlWithProtocol(resource.url)}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <div className='group border border-gray-300 hover:border-dial-sunshine shadow-md'>
                            <div className='flex gap-3 px-3'>
                              <div className='flex flex-col gap-2 px-3 py-4'>
                                <div className='font-semibold'>
                                  {resource.name}
                                </div>
                                <div className='text-sm'>
                                  {resource.description}
                                </div>
                              </div>
                              <HiExternalLink className='my-auto shrink-0' />
                            </div>
                          </div>
                        </a>
                      ))
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

const PlayCommentCount = ({ playbookSlug, play, locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, loading, error } = useQuery(COMMENTS_COUNT_QUERY, {
    variables: { commentObjectType: ObjectType.PLAY, commentObjectId: parseInt(play.id) },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <div className='text-sm flex gap-2'>
      {loading && 'Counting comments...'}
      {error && 'Error reading comments...'}
      {data &&
        <Link
          href={`${playbookSlug}/plays/${play.slug}`}
          className='px-3 rounded border border-dial-blueberry hover:bg-dial-blueberry hover:text-dial-cotton'
        >
          <div className='flex gap-2 py-1'>
            <FaCommentAlt className='my-auto' />
            {format('ui.play.commentCount.title', { commentCount: data.countComments })}
          </div>
        </Link>
      }
    </div>
  )
}

const PlaybookPlay = ({ index, playSlug, playbookSlug, locale, playRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, loading, error } = useQuery(PLAY_QUERY, {
    variables: { playSlug, playbookSlug, owner: 'public' },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  const { loadingUserSession, user } = useUser()
  const allowedToEdit = () => user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser

  const { setPlayPercentages } = useContext(PlaybookContext)
  const [displayRearrangeDialog, setDisplayRearrangeDialog] = useState(false)
  const onRearrangeDialogClose = () => {
    setDisplayRearrangeDialog(false)
  }

  const { ref } = useInView({
    threshold: [0.001, 0.2, 0.4, 0.6, 0.8, 0.999],
    onChange: (inView, entry) => {
      setPlayPercentages(
        previousPlayPercentage => ({
          ...previousPlayPercentage,
          [playSlug]: entry.intersectionRatio
        })
      )
    }
  })

  const scrollRef = useRef(null)
  useEffect(() => {
    if (playRefs.current) {
      playRefs.current[playSlug] = scrollRef
    }
  }, [scrollRef, playRefs, playSlug])

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.play) {
    return handleMissingData()
  }

  const { play: play } = data
  const { playMoves: playMoves } = play

  const generateEditLink = () => {
    return `/playbooks/${playbookSlug}/plays/${playSlug}/edit`
  }

  const generateAddPlayMoveLink = () => {
    return `/playbooks/${playbookSlug}/plays/${playSlug}/move/create`
  }

  return (
    <div className='my-3 intersection-observer' ref={ref}>
      {loadingUserSession
        ? <div className='absolute top-2 right-2'>{format('general.loadingData')}</div>
        : (
          <div className='flex flex-col gap-3 sticky-scroll-offset' ref={scrollRef}>
            <div className='flex flex-wrap gap-3'>
              <Link href={`/playbooks/${playbookSlug}/plays/${play.slug}`}>
                <div className={`font-semibold text-2xl flex gap-2 ${play.draft && 'text-dial-sapphire'}`}>
                  {!isNaN(index) && `${format('ui.play.label')} ${index + 1}. ${play.name}`}
                  {isNaN(index) && `${play.name}`}
                  {play.draft &&
                    <span className='font-bold'>
                      ({format('ui.play.status.draft')})
                    </span>
                  }
                </div>
              </Link>
              <div className='ml-auto my-auto flex gap-2'>
                {allowedToEdit() && <EditButton type='link' href={generateEditLink()} />}
                {allowedToEdit() && <UnassignPlay playbookSlug={playbookSlug} playSlug={playSlug} />}
              </div>
            </div>
            {!isNaN(index) &&
              <PlayCommentCount
                playbookSlug={playbookSlug}
                play={play}
                locale={locale}
              />
            }
            <HtmlViewer initialContent={play?.playDescription?.description} />
            <div className='flex gap-2 ml-auto'>
              {allowedToEdit() &&
                <CreateButton
                  type='link'
                  label={format('ui.move.add')}
                  href={generateAddPlayMoveLink()}
                />
              }
              {allowedToEdit() && playMoves.length > 0 &&
                <button
                  type='button'
                  onClick={() => setDisplayRearrangeDialog(!displayRearrangeDialog)}
                  className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-dial-cotton'
                >
                  <FiMove className='inline pb-0.5' />
                  <span className='text-sm px-1'>
                    {format('ui.move.rearrange')}
                  </span>
                </button>
              }
            </div>
            {playMoves.map((playMove, index) =>
              <PlayMove
                key={index}
                playSlug={playSlug}
                playMoveName={playMove.name}
                moveSlug={playMove.slug}
                playbookSlug={playbookSlug}
              />
            )}
            <RearrangePlayMoves
              onRearrangeDialogClose={onRearrangeDialogClose}
              displayRearrangeDialog={displayRearrangeDialog}
              play={play}
            />
          </div>
        )}
    </div>
  )
}

export default PlaybookPlay
