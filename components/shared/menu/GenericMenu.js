import Link from 'next/link'
import { MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const SEPARATOR_STYLES = 'bg-dial-slate-300 text-dial-stratos font-semibold px-4 py-3'
const SINGLE_MENU_STYLES = 'pl-1 py-2 cursor-pointer border-b border-transparent hover:border-dial-sunshine'

const GenericMenu = ({ menuConfiguration, onToggleDropdown, currentOpenMenu }) => {
  const { slug, name, targetUrl, external, menuItemConfigurations } = menuConfiguration

  const separatorRenderer = (name, styles) => (
    <div key={slug} className={styles} role='separator'>
      {name}
    </div>
  )

  const externalLinkRenderer = (slug, name, targetUrl, styles) => (
    <a
      key={slug}
      href={targetUrl}
      role='menu-item'
      target='_blank'
      rel='noopener noreferrer'
      className={styles}
    >
      {name}
    </a>
  )

  const internalLinkRenderer = (slug, name, targetUrl, styles) => (
    <Link key={slug} href={targetUrl} role='menu-item' className={styles}>
      {name}
    </Link>
  )

  const nestedMenuRenderer = () => (
    <>
      <MenuHeader
        id={slug}
        title={name}
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === slug && (
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          {menuItemConfigurations.map(({ type, slug, name, external, targetUrl }) => {
            return type === 'separator'
              ? separatorRenderer(name, SEPARATOR_STYLES)
              : external
                ? externalLinkRenderer(slug, name, targetUrl, DEFAULT_DROPDOWN_MENU_STYLES)
                : internalLinkRenderer(slug, name, targetUrl, DEFAULT_DROPDOWN_MENU_STYLES)
          })}
        </div>
      )}
    </>
  )

  const singleMenuRenderer = () => (
    external
      ? externalLinkRenderer(slug, name, targetUrl, SINGLE_MENU_STYLES)
      : internalLinkRenderer(slug, name, targetUrl, SINGLE_MENU_STYLES)
  )

  return menuConfiguration.menuItemConfigurations.length > 0
    ? nestedMenuRenderer(menuConfiguration)
    : singleMenuRenderer(menuConfiguration)
}

export default GenericMenu
