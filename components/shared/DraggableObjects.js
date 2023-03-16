import { useRef, useCallback } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'
import classNames from 'classnames'
import { IoClose } from 'react-icons/io5'

const DraggableCard = ({ index, dragable, moveDragable, removeDragable }) => {
  const ref = useRef(null)
  const [{ handlerId }, drop] = useDrop({
    accept: 'dragable',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item, monitor) {
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
      moveDragable(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const [{ opacity }, drag, preview] = useDrag({
    type: 'dragable',
    item: () => {
      return { id: dragable.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))

  const dndBorderStyles = classNames(
    'bg-white cursor-move shadow-md rounded-sm',
    'border border-transparent hover:border-dial-lavender border-opacity-80'
  )

  return (
    <div style={{ opacity }} data-handler-id={handlerId} className='inline overflow-hidden'>
      <div className='flex flex-row gap-3'>
        <div ref={preview} className='w-full' data-testid='pill'>
          <div ref={ref} className={`${dndBorderStyles} flex flex-row gap-2 px-2 py-1`}>
            <div className='my-auto'>{index + 1}.</div>
            <div className='my-auto'>
              {dragable.name}
            </div>
            <button type='button' className='my-auto' onClick={() => removeDragable(dragable)}>
              <IoClose
                className='text-dial-stratos opacity-50'
                size='1.5em'
                data-testid='remove-button'
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DraggableObjects = ({ dragables, setDragables, afterMoveHandler, afterRemoveHandler }) => {
  const removeDragable = useCallback(
    (removedDragable) => {
      setDragables(dragables.filter((dragable) => dragable.slug !== removedDragable.slug))
      if (afterRemoveHandler && {}.toString.call(afterRemoveHandler) === '[object Function]') {
        afterRemoveHandler()
      }
    },
    [dragables, setDragables, afterRemoveHandler]
  )

  const moveDragable = useCallback(
    (dragIndex, hoverIndex) => {
      setDragables((buildingBlocks) =>
        update(
          buildingBlocks,
          { $splice: [[dragIndex, 1], [hoverIndex, 0, buildingBlocks[dragIndex]]] }
        )
      )
      if (afterMoveHandler && {}.toString.call(afterMoveHandler) === '[object Function]') {
        afterMoveHandler()
      }
    },
    [setDragables, afterMoveHandler]
  )

  const renderCard = useCallback((dragable, index) => (
    <div key={index}>
      <DraggableCard {...{ index, dragable, moveDragable, removeDragable }} />
    </div>
  ), [moveDragable, removeDragable])

  return (
    <div className='flex flex-wrap gap-2 text-dial-stratos'>
      {dragables.map((dragable, index) => renderCard(dragable, index))}
    </div>
  )
}

export default DraggableObjects
