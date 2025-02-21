import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { NONE } from './menu/MenuCommon'
import LanguageMenu from './menu/LanguageMenu'

const EmbeddedHeader = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [currentOpenMenu, setCurrentOpenMenu] = useState(NONE)

  const toggleDropdownSwitcher = (expectedMenuItem) => {
    setCurrentOpenMenu(currentOpenMenu === expectedMenuItem ? NONE : expectedMenuItem)
  }

  useEffect(() => {
    const handleClick = (e) => {
      const event = e || window.event
      const target = event.target || event.srcElement
      const closestAnchor = target.closest('a')
      if (closestAnchor) {
        const id = closestAnchor.getAttribute('id')
        if (!id || (id !== currentOpenMenu && currentOpenMenu !== NONE)) {
          setCurrentOpenMenu(NONE)
        }
      }

      if (!closestAnchor) {
        const closestSvg = target.closest('svg')
        if (!closestSvg) {
          setCurrentOpenMenu(NONE)
        } else {
          const id = closestSvg.getAttribute('id')
          if (!id || (`svg-down-${currentOpenMenu}` !== id && `svg-up-${currentOpenMenu}` !== id)) {
            setCurrentOpenMenu(NONE)
          }
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [currentOpenMenu])

  return (
    <header className='z-70 sticky top-0 bg-white px-4 lg:px-8 xl:px-24 3xl:px-56'>
      <div className='flex flex-wrap justify-center border-b-2 items-center border-dial-gray-dark header-min-height'>
        <div className='flex-1 flex my-auto'>
          <a href='' className='text-center mx-auto'>
            <div className='text-dial-blue-darkest text-xs'>
              Powered By
            </div>
            <div className='font-bold text-dial-sapphire-darkest'>
              <span className='block'>
                <a href='https://exchange.dial.global' target='_blank' rel='noreferrer'>
                  {format('app.title')}
                </a>
              </span>
            </div>
          </a>
        </div>
        <div className='hidden lg:flex lg:items-center lg:w-auto w-full' id='menu'>
          <nav>
            <ul className='hidden xl:flex items-center ml-auto gap-x-3'>
              <li className='relative text-right text-dial-stratos'>
                <LanguageMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default EmbeddedHeader
