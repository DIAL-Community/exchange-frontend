import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { ADMIN_MENU, MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const AdminMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const adminPopoverButton = useRef()
  const adminPopoverRe = useRef()

  return (
    <>
      <MenuHeader
        id={ADMIN_MENU}
        ref={adminPopoverButton}
        title='header.admin'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {
        currentOpenMenu === ADMIN_MENU &&
          <div
            className={DEFAULT_DROPDOWN_PANEL_STYLES}
            ref={adminPopoverRe}
            role='menu'
            data-testid='menu-admin-items'
          >
            <Link href='/users' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.admin.users')}
            </Link>
            <hr className='mx-4 border border-gray-200' />
            <Link href='/countries' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.admin.countries')}
            </Link>
            <Link href='/sectors' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.admin.sectors')}
            </Link>
            <Link href='/tags' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.admin.tags')}
            </Link>
            <hr className='mx-4 border border-gray-200' />
            <Link href='/candidate/datasets' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.admin.candidate_datasets')}
            </Link>
            <Link href='/candidate/organizations' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.admin.candidate_orgs')}
            </Link>
            <Link href='/candidate/products' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.admin.candidate_products')}
            </Link>
            <Link href='/candidate/roles' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.admin.candidate_roles')}
            </Link>
            <hr className='mx-4 border border-gray-200' />
            <Link href='/rubric_categories' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('rubric-categories.header')}
            </Link>
            <hr className='mx-4 border border-gray-200' />
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
