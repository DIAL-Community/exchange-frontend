import { useContext } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { FilterContext } from '../../context/FilterContext'

const BuildingBlockHint = () => {
  const { setHintDisplayed } = useContext(FilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <div className='grid grid-cols-11 gap-4 pb-4 pt-8 text-dial-gray-dark'>
        <div className='col-span-11'>
          <div className='text-sm flex flex-col'>
            <div className='text-xl font-semibold px-8 pb-3'>
              {format('buildingBlock.label')}
            </div>
            <div className='text-base px-8'>
              {format('buildingBlock.hint.subtitle')}
            </div>
            <img className='w-48 h-48 mt-8 mx-auto xl:mt-0' src='images/tiles/building-block.svg' alt='' />
          </div>
        </div>
        <div className='col-span-11'>
          <div className='text-lg px-8 pb-3'>
            {format('buildingBlock.hint.characteristicTitle').toUpperCase()}
          </div>
          <div className='fr-view text-sm pr-1 pb-3'>
            {parse(format('buildingBlock.hint.characteristics'))}
          </div>
          <div className='text-lg px-8 pb-3'>
            {format('buildingBlock.hint.descriptionTitle').toUpperCase()}
          </div>
          <div className='text-sm px-8 pb-3 max-w-4xl'>
            {format('buildingBlock.hint.description')}
          </div>
        </div>
        <div className='absolute right-2 top-2'>
          <a
            className='cursor-pointer bg-button-gray p-3 float-right rounded text-button-gray-light'
            onClick={() => setHintDisplayed(false)}
          >
            {format('general.close')}
          </a>
        </div>
      </div>
    </>
  )
}

export default BuildingBlockHint
