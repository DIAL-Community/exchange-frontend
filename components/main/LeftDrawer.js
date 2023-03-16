import { useContext, useEffect, useState } from 'react'
import { BsChevronDoubleLeft, BsChevronDoubleRight } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'

const LeftDrawer = ({ filter, hint }) => {
  const { hintDisplayed, filterDisplayed, setFilterDisplayed } = useContext(FilterContext)
  const [openingFilter, setOpeningFilter] = useState(true)

  const toggleDrawer = () => {
    setOpeningFilter(!openingFilter)
    if (openingFilter) {
      setFilterDisplayed(false)
    }
  }

  const transitionEndHandler = () => {
    if (openingFilter) {
      setFilterDisplayed(true)
    }
  }

  const divToggleDrawer = () => {
    if (!filterDisplayed) {
      setOpeningFilter(!openingFilter)
      if (openingFilter) {
        setFilterDisplayed(false)
      }
    }
  }

  useEffect(() => {
    if (openingFilter) {
      setFilterDisplayed(true)
    }
  }, [])

  return (
    <div
      onClick={divToggleDrawer}
      className={`hidden md:flex sticky h-full ${!filterDisplayed && 'cursor-pointer'}`}
      style={{ left: 0, top: '200px', height: 'calc(100vh - 200px)' }}
    >
      <div
        className={`
          ${openingFilter ? 'drawer-expanded' : 'drawer-collapsed'}
          overflow-auto animated-drawer border-r-3 bg-dial-gray border-dial-gray
        `}
        style={{ boxShadow: '6px 0 6px -2px rgba(0, 0, 0, 0.3)', left: 0, top: '166px' }}
        onTransitionEnd={transitionEndHandler}
      >
        <div className={`card ${hintDisplayed ? 'flip-vertical' : ''}`}>
          <div className='card-body'>
            <div className='card-front'>
              {filterDisplayed && filter}
            </div>
            <div className='card-back flip-vertical'>
              {filterDisplayed && hintDisplayed && hint}
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={toggleDrawer}
        className='my-auto cursor-pointer bg-dial-gray h-12 w-6 rounded-r-full z-20'
        style={{ boxShadow: '6px 0px 6px -2px rgba(0, 0, 0, 0.3)', top: '55%' }}
      >
        <div className='h-full float-right mt-4 mr-2'>
          {openingFilter ? <BsChevronDoubleLeft /> : <BsChevronDoubleRight />}
        </div>
      </div>
    </div>
  )
}

export default LeftDrawer
