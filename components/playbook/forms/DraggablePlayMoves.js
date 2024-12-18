import { useCallback, useContext, useEffect } from 'react'
import update from 'immutability-helper'
import { useIntl } from 'react-intl'
import DraggableCard from './DraggableCard'
import { DraggableContext } from './DraggableContext'

const DraggablePlayMoves = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentPlayMoves, setDirty, setCurrentPlayMoves } = useContext(DraggableContext)

  const swapPlayMove = useCallback((dragIndex, hoverIndex) => {
    setDirty(true)
    setCurrentPlayMoves((currentPlayMoves) => update(currentPlayMoves, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, currentPlayMoves[dragIndex]]]
    }))
  }, [setCurrentPlayMoves, setDirty])

  const renderCard = useCallback((playMove, index) => (
    <DraggableCard
      key={index}
      id={playMove.id}
      index={index}
      entity={playMove}
      swapEntity={swapPlayMove}
    />
  ), [swapPlayMove])

  useEffect(() => {
    if (play) {
      const { playMoves } = play
      setCurrentPlayMoves(playMoves.map(playMove => ({ id: playMove.id, slug: playMove.slug, name: playMove.name })))
    }
  }, [play, setCurrentPlayMoves])

  const displayNoData = () =>
    <div className='text-sm font-medium opacity-80'>
      {format('noResults.entity', { entity: format('ui.move.label').toString().toLowerCase() })}
    </div>

  const displayPlayMoves = () =>
    <div className='flex flex-col gap-2'>
      {currentPlayMoves.map((playMove, index) => renderCard(playMove, index))}
    </div>

  return (
    <div className='flex flex-col gap-2 text-dial-purple-light'>
      {currentPlayMoves.length > 0 ? displayPlayMoves() : displayNoData()}
    </div>
  )
}

export default DraggablePlayMoves
