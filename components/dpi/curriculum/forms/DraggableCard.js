import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { FiMove } from 'react-icons/fi'

const DraggableCard = ({ id, entity, index, swapEntity }) => {
  const ref = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'entity',
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
      swapEntity(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const [{ opacity }, drag, preview] = useDrag({
    type: 'entity',
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))

  const dndBorderStyles = `
    bg-white cursor-move shadow-md overflow-hidden
    border border-dial-gray border-transparent hover:border-dial-purple-light border-opacity-80
  `

  return (
    <div style={{ opacity }} data-handler-id={handlerId}>
      <div className='flex gap-3'>
        <div className='py-4 font-semibold w-4'>{index + 1})</div>
        <div ref={preview} className='w-full'>
          <div ref={ref} className={`${dndBorderStyles} flex flex-row gap-3 px-3 py-4 h-16`}>
            <div className='font-semibold my-auto whitespace-nowrap overflow-hidden text-ellipsis'>
              {entity.name}
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

export default DraggableCard
