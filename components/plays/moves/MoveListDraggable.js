import { useRef, useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'
import parse from 'html-react-parser'
import { UPDATE_MOVE_ORDER } from '../../../mutations/move'
import { MovePreviewDispatchContext } from './MovePreviewContext'
import { MoveListContext, MoveListDispatchContext } from './MoveListContext'

const DraggableCard = ({ id, move, index, swapMove, unassignMove, previewMove }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const ref = useRef(null)

  const openPreviewMove = (move) => {
    previewMove(move)
  }

  const [{ handlerId }, drop] = useDrop({
    accept: 'move',
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
      swapMove(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const [{ opacity }, drag, preview] = useDrag({
    type: 'move',
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
    if (move.moveDescription) {
      // Try getting the first non empty description string for the card. This is needed to make sure
      // the movable card doesn't use the whole text data of the description. That will make the moveable
      // card yuge.
      let currentIndex = 0
      while (!returnValue.trim() && currentIndex >= 0) {
        const currentNewLineIndex = move.moveDescription.description.indexOf('\n', currentIndex)
        const substringIndex = currentNewLineIndex >= 0 && currentNewLineIndex <= 80 ? currentNewLineIndex : 80
        returnValue = move.moveDescription.description.substring(currentIndex, substringIndex)
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
          <div ref={ref} className={`${dndBorderStyles} flex flex-row gap-3 px-3 py-4 h-16 w-full`}>
            <div className='w-3/12 font-semibold my-auto whitespace-nowrap overflow-hidden text-ellipsis'>
              {move.name}
            </div>
            {
              // Manual alignment for the description because can't do my-auto to center the text.
              // The original text is large and we're using play-list-description to force it to become 1 line.
            }
            <div className='w-6/12 single-line-description whitespace-nowrap overflow-hidden text-ellipsis fr-view my-1'>
              {parse(shortenedDescription)}
            </div>
            <div className='w-3/12 my-auto flex gap-2 text-sm'>
              <button
                type='button'
                className='ml-auto bg-dial-orange-light text-dial-purple py-1.5 px-3 rounded disabled:opacity-50'
                onClick={() => openPreviewMove(move)}
              >
                {format('move.preview')}
              </button>
              <button
                type='button'
                className='bg-dial-purple-light text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50'
                onClick={() => unassignMove(move)}
              >
                {format('move.unassign')}
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

const MoveListDraggable = ({ playbook, play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentMoves } = useContext(MoveListContext)
  const { setCurrentMoves } = useContext(MoveListDispatchContext)
  const { setPreviewSlug, setPreviewContext, setPreviewDisplayed } = useContext(MovePreviewDispatchContext)

  const [updateMoveOrder] = useMutation(UPDATE_MOVE_ORDER)

  const unassignMove = useCallback((move) => {
    // Mark move as un-assigned. This will trigger deletion from the context component.
    setCurrentMoves(currentMoves.filter(
      currentMove => currentMove.slug !== move.slug)
    )
    if (move) {
      updateMoveOrder({
        variables: {
          playSlug: play.slug,
          moveSlug: move.slug,
          operation: 'UNASSIGN',
          distance: 0
        }
      })
    }
  }, [currentMoves, setCurrentMoves, play, updateMoveOrder])

  const previewMove = useCallback((move) => {
    setPreviewDisplayed(true)
    setPreviewSlug(move.slug)
    setPreviewContext([playbook.slug, play.slug])
  }, [play, playbook, setPreviewContext, setPreviewSlug, setPreviewDisplayed])

  const swapMove = useCallback((dragIndex, hoverIndex) => {
    setCurrentMoves((prevCards) => update(prevCards, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, prevCards[dragIndex]]
      ]
    }))
    if (play && dragIndex >= 0 && hoverIndex >= 0) {
      updateMoveOrder({
        variables: {
          playSlug: play.slug,
          moveSlug: currentMoves[dragIndex].slug,
          operation: 'SWAP',
          distance: hoverIndex - dragIndex
        }
      })
    }
  }, [currentMoves, setCurrentMoves, play, updateMoveOrder])

  const renderCard = useCallback((move, index) => (
    <div key={index}>
      <DraggableCard id={move.id} {...{ index, move, swapMove, unassignMove, previewMove }} />
    </div>
  ), [swapMove, previewMove, unassignMove])

  useEffect(() => {
    if (play) {
      setCurrentMoves(play.playMoves)
    }
  }, [play, setCurrentMoves])

  return (
    <div className='flex flex-col gap-2 text-dial-purple-light'>
      {
        currentMoves.length > 0
          ? currentMoves.map((move, index) => renderCard(move, index))
          : (
            <div className='text-sm font-medium opacity-80'>
              {format('noResults.entity', { entity: format('move.label').toString().toLowerCase() })}
            </div>
          )
      }
    </div>
  )
}

export default MoveListDraggable
