import Link from 'next/link'
import { MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const SEPARATOR_STYLES = 'bg-dial-slate-300 text-dial-stratos font-semibold px-4 py-3'
const SINGLE_MENU_STYLES = 'pl-1 py-2 cursor-pointer border-b border-transparent hover:border-dial-sunshine'

const GenericMenu = ({ menuConfiguration, onToggleDropdown, currentOpenMenu }) => {
  const { id, name, destinationUrl, external, menuItemConfigurations } = menuConfiguration

  const separatorRenderer = (name, styles) => (
    <div key={id} className={styles} role='separator'>
      {name}
    </div>
  )

  const externalLinkRenderer = (id, name, destinationUrl, styles) => (
    <a
      key={id}
      href={`//${destinationUrl}`}
      role='menu-item'
      target='_blank'
      rel='noopener noreferrer'
      className={styles}
    >
      {name}
    </a>
  )

  const internalLinkRenderer = (id, name, destinationUrl, styles) => (
    <Link key={id} href={destinationUrl} role='menu-item' className={styles}>
      {name}
    </Link>
  )

  const nestedMenuRenderer = () => (
    <>
      <MenuHeader
        id={id}
        title={name}
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === id && (
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          {menuItemConfigurations.map(({ id, type, name, external, destinationUrl }) => {
            return type === 'separator'
              ? separatorRenderer(name, SEPARATOR_STYLES)
              : external
                ? externalLinkRenderer(id, name, destinationUrl, DEFAULT_DROPDOWN_MENU_STYLES)
                : internalLinkRenderer(id, name, destinationUrl, DEFAULT_DROPDOWN_MENU_STYLES)
          })}
        </div>
      )}
    </>
  )

  const singleMenuRenderer = () => (
    external
      ? externalLinkRenderer(id, name, destinationUrl, SINGLE_MENU_STYLES)
      : internalLinkRenderer(id, name, destinationUrl, SINGLE_MENU_STYLES)
  )

  return menuConfiguration.menuItemConfigurations.length > 0
    ? nestedMenuRenderer(menuConfiguration)
    : singleMenuRenderer(menuConfiguration)
}

export default GenericMenu
