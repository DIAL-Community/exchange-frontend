import { useRef, useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'
import { FiMove } from 'react-icons/fi'
import { MoveListContext, MoveListDispatchContext } from './context/MoveListContext'

const DraggableCard = ({ id, move, index, swapMove }) => {
  const ref = useRef(null)

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
    bg-white cursor-move shadow-md
    border border-transparent hover:border-dial-sapphire border-opacity-80
  `

  return (
    <div style={{ opacity }} data-handler-id={handlerId}>
      <div className='flex gap-3'>
        <div className='py-4 font-semibold w-4'>{index + 1})</div>
        <div ref={preview} className='w-full'>
          <div ref={ref} className={`${dndBorderStyles} flex flex-nowrap gap-3 px-3 py-4 h-16`}>
            <div className='font-semibold my-auto whitespace-nowrap overflow-hidden text-ellipsis'>
              {move.name}
            </div>
            <div className='my-auto ml-auto'>
              <FiMove />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MoveListDraggable = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentMoves } = useContext(MoveListContext)
  const { setCurrentMoves, setDirty } = useContext(MoveListDispatchContext)

  const swapMove = useCallback((dragIndex, hoverIndex) => {
    setDirty(true)
    setCurrentMoves((currentMoves) => update(currentMoves, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, currentMoves[dragIndex]]]
    }))
  }, [setCurrentMoves, setDirty])

  const renderCard = useCallback((move, index) => (
    <DraggableCard key={index} id={move.id} {...{ index, move, swapMove }} />
  ), [swapMove])

  useEffect(() => {
    if (play) {
      setCurrentMoves(play.playMoves)
    }
  }, [play, setCurrentMoves])

  const displayNoData = () =>
    <div className='text-sm font-medium opacity-80'>
      {format('noResults.entity', { entity: format('ui.move.label').toString().toLowerCase() })}
    </div>

  const displayRearrangeMoves = () =>
    <div className='flex flex-col gap-2'>
      {currentMoves.map((move, index) => renderCard(move, index))}
    </div>

  return (
    <div className='flex flex-col gap-2 text-dial-purple-light'>
      {currentMoves.length > 0 ? displayRearrangeMoves() : displayNoData()}
    </div>
  )
}

export default MoveListDraggable
