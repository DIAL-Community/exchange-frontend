import { useRef, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { HiSortAscending } from 'react-icons/hi'
import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'

const DraggableCard = ({ id, play, index, moveCard }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
      moveCard(dragIndex, hoverIndex)
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

  return (
    <div ref={preview} style={{ opacity }} data-handler-id={handlerId} className='inline'>
      <div className='grid grid-cols-3 border-2 border-dial-gray hover:border-dial-yellow text-workflow hover:text-dial-yellow cursor-pointer p-3 m-2'>
        <div>
          {play.name}
        </div>
        <div>
          {play.desc}
        </div>
        <div className='cursor-move' ref={ref}>
          <img
            alt={format('image.alt.logoFor', { name: format('view.active.move') })}
            className='h-6 float-right' src='/icons/move/move.png'
          />
        </div>
      </div>
    </div>
  )
}

const DraggablePlayList = ({ playList, setPlayList }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setPlayList((prevCards) => update(prevCards, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, prevCards[dragIndex]]
      ]
    }))
  }, [])

  const renderCard = useCallback((play, index) => {
    return (<DraggableCard key={play.id} id={play.id} index={index} play={play} moveCard={moveCard} />)
  }, [])

  return (
    <>
      <div className='grid grid-cols-1'>
        <div className='grid grid-cols-12 my-3 px-4'>
          <div className='col-span-5 ml-2 text-sm font-semibold opacity-70'>
            {format('play.header').toUpperCase()}
            <HiSortAscending className='hidden ml-1 inline text-2xl' />
          </div>
          <div className='hidden md:block col-span-3 text-sm font-semibold opacity-50'>
            {format('plays.description').toUpperCase()}
            <HiSortAscending className='hidden ml-1 inline text-2xl' />
          </div>
        </div>
        {playList.length > 0
          ? playList.map((play, index) => {
              return renderCard(play, index)
            })
          : (
            <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-1'>
              {format('noResults.entity', { entity: format('plays.label') })}
            </div>
            )}
      </div>
    </>
  )
}

export default DraggablePlayList
