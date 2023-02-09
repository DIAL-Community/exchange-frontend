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
    <div className='flex gap-4'>
      {
        displayType === 'card' &&
        <>
          <div className='relative'>
            <Image
              width={24}
              height={24}
              alt='Card view toggle'
              src='/assets/card/card.png'
            />
          </div>
          <a href='toggle-display' onClick={toggleDisplayType}>
            <Image
              width={28}
              height={24}
              alt='List view toggle'
              src='/assets/list/list.png'
              className='opacity-20'
            />
          </a>
        </>
      }
      {
        displayType === 'list' &&
        <>
          <a href='toggle-display' onClick={toggleDisplayType}>
            <Image
              width={24}
              height={24}
              alt='Card view toggle'
              src='/assets/card/card.png'
              className='opacity-20'
            />
          </a>
          <div className='relative'>
            <Image
              width={28}
              height={24}
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
