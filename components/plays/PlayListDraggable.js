import { useRef, useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useDrag, useDrop } from 'react-dnd'
import { FiMove } from 'react-icons/fi'
import update from 'immutability-helper'
import { PlayListContext, PlayListDispatchContext } from './PlayListContext'

const DraggableCard = ({ id, play, index, movePlay }) => {
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
    <div style={{ opacity }} data-handler-id={handlerId}>
      <div className='flex gap-3'>
        <div className='py-4 font-semibold w-4'>{index + 1})</div>
        <div ref={preview} className='w-full'>
          <div ref={ref} className={`${dndBorderStyles} flex flex-row gap-3 px-3 py-4 h-16`}>
            <div className='font-semibold my-auto whitespace-nowrap overflow-hidden text-ellipsis'>
              {play.name}
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

const PlayListDraggable = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentPlays } = useContext(PlayListContext)
  const { setCurrentPlays, setDirty } = useContext(PlayListDispatchContext)

  const movePlay = useCallback(
    (dragIndex, hoverIndex) => {
      setDirty(true)
      setCurrentPlays((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]]
          ]
        })
      )
    },
    [setCurrentPlays, setDirty]
  )

  const renderCard = useCallback((play, index) => (
    <DraggableCard key={index} id={play.id} {...{ index, play, movePlay }} />
  ), [movePlay])

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
