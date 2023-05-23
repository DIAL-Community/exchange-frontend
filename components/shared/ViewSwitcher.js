import Image from 'next/image'
import { useContext } from 'react'
import { FilterContext } from '../context/FilterContext'

const ViewSwitcher = () => {
  const { displayType, setDisplayType } = useContext(FilterContext)

  const toggleDisplayType = (e) => {
    e.preventDefault()
    setDisplayType(displayType === 'list' ? 'card' : 'list')
  }

  return (
    <div className='flex gap-3'>
      {
        displayType === 'card' &&
        <>
          <div className='relative w-6 h-6'>
            <Image
              fill
              className='object-contain'
              alt='Card view toggle'
              src='/assets/card/card.png'
            />
          </div>
          <a href='toggle-display' onClick={toggleDisplayType} className='relative w-6 h-6'>
            <Image
              fill
              className='opacity-20 object-contain'
              alt='List view toggle'
              src='/assets/list/list.png'
            />
          </a>
        </>
      }
      {
        displayType === 'list' &&
        <>
          <a href='toggle-display' onClick={toggleDisplayType} className='relative w-6 h-6'>
            <Image
              fill
              className='opacity-20 object-contain'
              alt='Card view toggle'
              src='/assets/card/card.png'
            />
          </a>
          <div className='relative w-6 h-6'>
            <Image
              fill
              className='object-contain'
              alt='List view toggle'
              src='/assets/list/list.png'
            />
          </div>
        </>
      }
    </div>
  )
}

export default ViewSwitcher
