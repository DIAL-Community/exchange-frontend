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
          <div className={DEFAULT_DROPDOWN_PANEL_STYLES} ref={adminPopoverRe} role='menu'  data-testid='menu-admin-items'>
            <Link href='/users'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.admin.users')}
              </a>
            </Link>
            <hr className='mx-4 border border-gray-200' />
            <Link href='/countries'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.admin.countries')}
              </a>
            </Link>
            <Link href='/sectors'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.admin.sectors')}
              </a>
            </Link>
            <Link href='/tags'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.admin.tags')}
              </a>
            </Link>
            <hr className='mx-4 border border-gray-200' />
            <Link href='/candidate/datasets'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.admin.candidate_datasets')}
              </a>
            </Link>
            <Link href='/candidate/organizations'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.admin.candidate_orgs')}
              </a>
            </Link>
            <Link href='/candidate/products'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.admin.candidate_products')}
              </a>
            </Link>
            <Link href='/candidate/roles'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.admin.candidate_roles')}
              </a>
            </Link>
            <hr className='mx-4 border border-gray-200' />
            <Link href='/rubric_categories'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('rubric-categories.header')}
              </a>
            </Link>
            <hr className='mx-4 border border-gray-200' />
            <Link href='/spreadsheets/datasets'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('spreadsheet.dataset.header')}
              </a>
            </Link>
            <Link href='/spreadsheets/products'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('spreadsheet.product.header')}
              </a>
            </Link>
          </div>
      }
    </>
  )
}

export default AdminMenu
