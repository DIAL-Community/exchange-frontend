import { useCallback, useContext, useEffect } from 'react'
import update from 'immutability-helper'
import { useIntl } from 'react-intl'
import DraggableCard from './DraggableCard'
import { DraggableContext } from './DraggableContext'

const DraggableModules = ({ curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentModules, setCurrentModules, setDirty } = useContext(DraggableContext)

  const moveModule = useCallback(
    (dragIndex, hoverIndex) => {
      setDirty(true)
      setCurrentModules((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]]
          ]
        })
      )
    },
    [setCurrentModules, setDirty]
  )

  const renderCard = useCallback((module, index) => (
    <DraggableCard
      key={index}
      id={module.id}
      index={index}
      entity={module}
      swapEntity={moveModule}
    />
  ), [moveModule])

  useEffect(() => {
    if (curriculum) {
      const { plays: modules } = curriculum
      setCurrentModules(modules.map(module => ({
        id: module.id,
        slug: module.slug,
        name: module.name,
        draft: module.draft
      })))
    }
  }, [curriculum, setCurrentModules])

  const displayModules = () =>
    <div className='flex flex-col gap-2'>
      {currentModules.map((module, index) => renderCard(module, index))}
    </div>

  const displayNoData = () =>
    <div className='text-sm font-medium opacity-80'>
      {format('noResults.entity', { entity: format('dpi.curriculum.module.label').toString().toLowerCase() })}
    </div>

  return (
    <div className='flex flex-col gap-2 text-dial-purple-light'>
      {currentModules.length > 0 ? displayModules() : displayNoData()}
    </div>
  )
}

export default DraggableModules
