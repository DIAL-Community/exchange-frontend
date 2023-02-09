import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FilterContext } from '../context/FilterContext'

const ViewSwitcher = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { displayType, setDisplayType } = useContext(FilterContext)

  const toggleDisplayType = (e) => {
    e.preventDefault()
    setDisplayType(displayType === 'list' ? 'card' : 'list')
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='text-xs my-auto font-semibold text-dial-gray-dark opacity-50'>
        {format('view.switch.title')}
      </div>
      <div className='my-auto pt-2 pb-3 px-2 flex flex-row'>
        {
          displayType === 'card' &&
          <>
            <img
              alt={format('image.alt.logoFor', { name: format('view.active.card') })}
              className='mr-2 h-6' src='/icons/card-active/card-active.png'
            />
            <a href='toggle-display' onClick={toggleDisplayType}>
              <img
                alt={format('image.alt.logoFor', { name: format('view.inactive.list') })}
                className='h-6 cursor-pointer' src='/icons/list-inactive/list-inactive.png'
              />
            </a>
          </>
        }
        {
          displayType === 'list' &&
          <>
            <a className='mr-2' href='toggle-display' onClick={toggleDisplayType}>
              <img
                alt={format('image.alt.logoFor', { name: format('view.inactive.card') })}
                className='h-6 cursor-pointer' src='/icons/card-inactive/card-inactive.png'
              />
            </a>
            <img
              alt={format('image.alt.logoFor', { name: format('view.active.list') })}
              className='h-6' src='/icons/list-active/list-active.png'
            />
          </>
        }
      </div>
    </div>
  )
}

export default ViewSwitcher
