import { useRef, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { gql, useMutation } from '@apollo/client'
import { useDrag, useDrop } from 'react-dnd'
import parse from 'html-react-parser'
import update from 'immutability-helper'
import { PlayPreviewDispatchContext } from './PlayPreviewContext'
import { PlayListContext, PlayListDispatchContext } from './PlayListContext'

const UPDATE_PLAY_ORDER = gql`
  mutation (
    $playbookSlug: String!,
    $playSlug: String!,
    $operation: String!,
    $distance: Int!
  ) {
    updatePlayOrder (
      playbookSlug: $playbookSlug,
      playSlug: $playSlug,
      operation: $operation,
      distance: $distance
    ) {
      play {
        id
        slug
      }
    }
  }
`

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

  const shortenedDescription = (() => {
    let returnValue = ''
    if (play.playDescription) {
      // Try getting the first non empty description string for the card. This is needed to make sure
      // the movable card doesn't use the whole text data of the description. That will make the moveable
      // card yuge.
      let currentIndex = 0
      while (!returnValue.trim() && currentIndex >= 0) {
        const currentNewLineIndex = play.playDescription.description.indexOf('\n', currentIndex)
        const substringIndex = currentNewLineIndex >= 0 && currentNewLineIndex <= 80 ? currentNewLineIndex : 80
        returnValue = play.playDescription.description.substring(currentIndex, substringIndex)
        currentIndex = currentNewLineIndex
      }
    }

    return returnValue
  })()

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
            <div className='w-full single-line-description whitespace-nowrap overflow-hidden text-ellipsis fr-view my-1'>
              {parse(shortenedDescription)}
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

  const [draggedPlay, setDraggedPlay] = useState([-1, -1])
  const [unassignedPlay, setUnassignedPlay] = useState('')

  const { currentPlays } = useContext(PlayListContext)
  const { setCurrentPlays } = useContext(PlayListDispatchContext)
  const { setPreviewSlug, setPreviewContext, setPreviewDisplayed } = useContext(PlayPreviewDispatchContext)

  const [updatePlayOrder] = useMutation(UPDATE_PLAY_ORDER)

  useEffect(() => {
    // Watch the unassigned play and delete them after render.
    if (unassignedPlay) {
      setCurrentPlays(currentPlays.filter(
        currentPlay => currentPlay.slug !== unassignedPlay.slug)
      )
      if (playbook) {
        updatePlayOrder({
          variables: {
            playbookSlug: playbook.slug,
            playSlug: unassignedPlay.slug,
            operation: 'UNASSIGN',
            distance: 0
          }
        })
      }
    }
  }, [unassignedPlay])

  useEffect(() => {
    const [dragIndex, hoverIndex] = draggedPlay
    if (playbook && dragIndex >= 0 && hoverIndex >= 0) {
      updatePlayOrder({
        variables: {
          playbookSlug: playbook.slug,
          playSlug: currentPlays[hoverIndex].slug,
          operation: 'SWAP',
          distance: hoverIndex - dragIndex
        }
      })
    }
  }, [draggedPlay])

  const unassignPlay = (play) => {
    // Mark play as un-assigned. This will trigger deletion from the context component.
    setUnassignedPlay(play)
  }

  const previewPlay = useCallback((play) => {
    setPreviewDisplayed(true)
    setPreviewContext(playbook.slug)
    setPreviewSlug(play.slug)
  }, [playbook, setPreviewContext, setPreviewSlug, setPreviewDisplayed])

  const movePlay = useCallback((dragIndex, hoverIndex) => {
    setCurrentPlays((prevCards) => update(prevCards, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, prevCards[dragIndex]]
      ]
    }))
    setDraggedPlay([dragIndex, hoverIndex])
  }, [setCurrentPlays])

  const renderCard = useCallback((play, index) => (
    <DraggableCard key={index} id={play.id} {...{ index, play, movePlay, unassignPlay, previewPlay }} />
  ), [movePlay, previewPlay])

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
