import { useRef, useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useDrag, useDrop } from 'react-dnd'
import parse from 'html-react-parser'
import update from 'immutability-helper'
import { PlayPreviewDispatchContext } from './PlayPreviewContext'
import { PlayListContext, PlayListDispatchContext } from './PlayListContext'

const DraggableCard = ({ id, play, index, movePlay, unassignPlay, previewPlay }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const ref = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'play',
    collect (monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover (item, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      movePlay(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const [{ opacity }, drag, preview] = useDrag({
    type: 'play',
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))

  const dndBorderStyles = `
    bg-white cursor-move card-drop-shadow overflow-hidden
    border border-dial-gray border-transparent hover:border-dial-purple-light border-opacity-80
  `

  return (
    <div style={{ opacity }} data-handler-id={handlerId} className='inline overflow-hidden'>
      <div className='flex flex-row gap-3'>
        <div className='py-4 font-semibold text-lg'>{index + 1})</div>
        <div ref={preview} className='w-full'>
          <div ref={ref} className={`${dndBorderStyles} flex flex-row gap-3 px-3 py-4 h-16`}>
            <div className='w-2/6 font-semibold my-auto whitespace-nowrap overflow-hidden text-ellipsis'>
              {play.name}
            </div>
            {
              // Manual alignment for the description because can't do my-auto to center the text.
              // The original text is large and we're using playbook-list-description to force it to become 1 line.
            }
            <div className='w-full line-clamp-1 fr-view my-1'>
              {play.playDescription && parse(play.playDescription.description)}
            </div>
            <div className='w-2/6 my-auto flex gap-2 text-sm'>
              <button
                type='button'
                className='ml-auto bg-dial-orange-light text-dial-purple py-1.5 px-3 rounded disabled:opacity-50'
                onClick={() => previewPlay(play)}
              >
                {format('play.preview')}
              </button>
              <button
                type='button'
                className='bg-dial-purple-light text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50'
                onClick={() => unassignPlay(play)}
              >
                {format('play.unassign')}
              </button>
              <img
                alt={format('image.alt.logoFor', { name: format('move.reOrder') })}
                className='h-6 my-auto' src='/icons/move/move.png'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PlayListDraggable = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentPlays } = useContext(PlayListContext)
  const { setCurrentPlays } = useContext(PlayListDispatchContext)
  const { setPreviewSlug, setPreviewContext, setPreviewDisplayed } = useContext(PlayPreviewDispatchContext)

  const unassignPlay = useCallback(
    (play) => setCurrentPlays(currentPlays.filter((currentPlay) => currentPlay.slug !== play.slug)),
    [currentPlays, setCurrentPlays]
  )

  const previewPlay = useCallback((play) => {
    setPreviewDisplayed(true)
    setPreviewContext(playbook.slug)
    setPreviewSlug(play.slug)
  }, [playbook, setPreviewContext, setPreviewSlug, setPreviewDisplayed])

  const movePlay = useCallback(
    (dragIndex, hoverIndex) =>
      setCurrentPlays((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]]
          ]
        })
      ),
    [setCurrentPlays]
  )

  const renderCard = useCallback((play, index) => (
    <DraggableCard key={index} id={play.id} {...{ index, play, movePlay, unassignPlay, previewPlay }} />
  ), [movePlay, previewPlay, unassignPlay])

  useEffect(() => {
    if (playbook) {
      setCurrentPlays(playbook.plays)
    }
  }, [playbook, setCurrentPlays])

  return (
    <div className='flex flex-col gap-2 text-dial-purple-light'>
      {
        currentPlays.length > 0
          ? currentPlays.map((play, index) => renderCard(play, index))
          : (
            <div className='text-sm font-medium opacity-80'>
              {format('noResults.entity', { entity: format('plays.label').toString().toLowerCase() })}
            </div>
          )
      }
    </div>
  )
}

export default PlayListDraggable
