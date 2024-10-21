import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { ADMIN_MENU, MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const AdminMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <MenuHeader
        id={ADMIN_MENU}
        titleKey='header.admin'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === ADMIN_MENU &&
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          <Link href='/task-trackers' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.taskTracker.header')}
          </Link>
          <Link href='/users' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.user.header')}
          </Link>
          <div className='mx-4 border-b border-dial-slate-300' />
          <Link href='/countries' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.country.header')}
          </Link>
          <Link href='/regions' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.region.header')}
          </Link>
          <Link href='/sectors' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.sector.header')}
          </Link>
          <Link href='/tags' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.tag.header')}
          </Link>
          <div className='mx-4 border-b border-dial-slate-300' />
          <Link href='/resource-topics' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.resourceTopic.header')}
          </Link>
          <div className='mx-4 border-b border-dial-slate-300' />
          <Link href='/candidate/datasets' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.candidateDataset.header')}
          </Link>
          <Link href='/candidate/organizations' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.candidateOrganization.header')}
          </Link>
          <Link href='/candidate/products' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.candidateProduct.header')}
          </Link>
          <Link href='/candidate/resources' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.candidateResource.header')}
          </Link>
          <Link href='/candidate/roles' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.candidateRole.header')}
          </Link>
          <div className='mx-4 border-b border-dial-slate-300' />
          <Link href='/rubric-categories' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.rubricCategory.header')}
          </Link>
          <div className='mx-4 border-b border-dial-slate-300' />
          <Link href='/spreadsheets/datasets' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('spreadsheet.dataset.header')}
          </Link>
          <Link href='/spreadsheets/products' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('spreadsheet.product.header')}
          </Link>
        </div>
      }
    </>
  )
}

export default AdminMenu
