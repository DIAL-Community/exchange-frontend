import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { FilterContext } from '../../context/FilterContext'

const SDGHint = () => {
  const { setHintDisplayed } = useContext(FilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      <div className='grid grid-cols-11 gap-4 pb-4 pt-8 text-dial-gray-dark'>
        <div className='col-span-11'>
          <div className='text-sm flex flex-col'>
            <div className='text-xl font-semibold px-8 pb-3'>
              {format('sdg.shortLabel')}
            </div>
            <div className='text-base px-8'>
              {format('sdg.hint.subtitle')}
            </div>
            <img className='w-48 h-48 mt-8 mx-auto xl:mt-0' src='images/tiles/sdg.svg' alt='' />
          </div>
        </div>
        <div className='col-span-11'>
          <div className='text-lg px-8 pb-3'>
            {format('sdg.hint.descriptionTitle').toUpperCase()}
          </div>
          <div className='text-sm px-8 pb-3 max-w-4xl'>
            {format('sdg.hint.description')}
          </div>
        </div>
        <div className='absolute right-4 top-4'>
          <button
            className='bg-button-gray p-3 float-right rounded text-button-gray-light'
            onClick={() => setHintDisplayed(false)}
          >
            {format('general.close')}
          </button>
        </div>
      </div>
    </>
  )
}

export default SDGHint
