import { useCallback, useContext, useEffect } from 'react'
import update from 'immutability-helper'
import { useIntl } from 'react-intl'
import DraggableCard from './DraggableCard'
import { DraggableContext } from './DraggableContext'

const DraggableSubModules = ({ module }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentSubModules, setDirty, setCurrentSubModules } = useContext(DraggableContext)

  const swapSubModule = useCallback((dragIndex, hoverIndex) => {
    setDirty(true)
    setCurrentSubModules((currentSubModules) => update(currentSubModules, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, currentSubModules[dragIndex]]]
    }))
  }, [setCurrentSubModules, setDirty])

  const renderCard = useCallback((subModule, index) => (
    <DraggableCard
      key={index}
      id={subModule.id}
      index={index}
      entity={subModule}
      swapEntity={swapSubModule}
    />
  ), [swapSubModule])

  useEffect(() => {
    if (module) {
      const { playMoves: subModules } = module
      setCurrentSubModules(subModules.map(subModule => ({ id: subModule.id, slug: subModule.slug, name: subModule.name })))
    }
  }, [module, setCurrentSubModules])

  const displayNoData = () =>
    <div className='text-sm font-medium opacity-80'>
      {format('noResults.entity', { entity: format('hub.curriculum.subModule.label').toString().toLowerCase() })}
    </div>

  const displaySubModules = () =>
    <div className='flex flex-col gap-2'>
      {currentSubModules.map((subModule, index) => renderCard(subModule, index))}
    </div>

  return (
    <div className='flex flex-col gap-2 text-dial-purple-light'>
      {currentSubModules.length > 0 ? displaySubModules() : displayNoData()}
    </div>
  )
}

export default DraggableSubModules
