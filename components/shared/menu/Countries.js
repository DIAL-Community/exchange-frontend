import Link from 'next/link'
import { useRef } from 'react'
import { COUNTRIES_MENU, MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const CountriesMenu = ({ currentOpenMenu, onToggleDropdown }) => {

  const countriesPopoverButton = useRef(null)
  const countriesPopover = useRef(null)

  const g20 = ['Argentina', 'Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'India', 'Indonesia',
    'Italy', 'Japan', 'Republic of Korea', 'Mexico', 'Russia', 'Saudi Arabia', 'South Africa', 'Türkiye',
    'United Kingdom', 'United States', 'European Union']

  return (
    <>
      <MenuHeader
        id={COUNTRIES_MENU}
        ref={countriesPopoverButton}
        title='header.countries'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === COUNTRIES_MENU &&
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} ref={countriesPopover} role='menu'>
          { g20.map((currCountry, i) => {
            return (<Link key={i} href={`/countries/${currCountry}`} role='menuitem'
              className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {currCountry}
            </Link>)
          })}
        </div>
      }
    </>
  )
}

export default CountriesMenu
