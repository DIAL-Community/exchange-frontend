import { useCallback, useContext, useEffect } from 'react'
import update from 'immutability-helper'
import { useIntl } from 'react-intl'
import DraggableCard from './DraggableCard'
import { DraggableContext } from './DraggableContext'

const DraggablePlays = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentPlays, setCurrentPlays, setDirty } = useContext(DraggableContext)

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
    <DraggableCard
      key={index}
      id={play.id}
      index={index}
      entity={play}
      swapEntity={movePlay}
    />
  ), [movePlay])

  useEffect(() => {
    if (playbook) {
      const { plays } = playbook
      setCurrentPlays(plays.map(play => ({
        id: play.id,
        slug: play.slug,
        name: play.name,
        draft: play.draft
      })))
    }
  }, [playbook, setCurrentPlays])

  const displayPlays = () =>
    <div className='flex flex-col gap-2'>
      {currentPlays.map((play, index) => renderCard(play, index))}
    </div>

  const displayNoData = () =>
    <div className='text-sm font-medium opacity-80'>
      {format('noResults.entity', { entity: format('ui.play.label').toString().toLowerCase() })}
    </div>

  return (
    <div className='flex flex-col gap-2 text-dial-purple-light'>
      {currentPlays.length > 0 ? displayPlays() : displayNoData()}
    </div>
  )
}

export default DraggablePlays
