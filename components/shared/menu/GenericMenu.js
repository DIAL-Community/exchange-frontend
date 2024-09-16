import Link from 'next/link'
import { MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const GenericMenu = ({ menuConfiguration, onToggleDropdown, currentOpenMenu }) => {
  const { slug, name, menuItems } = menuConfiguration

  return (
    <>
      <MenuHeader
        id={slug}
        title={name}
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === slug && (
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          {menuItems.map(({ type, slug, name, external, url }) => {
            return type === 'separator'
              ? <div key={slug} className='bg-dial-slate-300 text-dial-stratos font-semibold px-4 py-3'>
                {name}
              </div>
              : external
                ? <a
                  key={slug}
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  role='menuitem'
                  className={DEFAULT_DROPDOWN_MENU_STYLES}
                >
                  {name}
                </a>
                : <Link href={url} role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                  {name}
                </Link>
          })}
        </div>
      )}
    </>
  )
}

export default GenericMenu
