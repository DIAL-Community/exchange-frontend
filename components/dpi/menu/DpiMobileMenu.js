import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const menuStyles = 'py-3 cursor-pointer border-b border-transparent hover:border-dial-sunshine'

const DpiMobileMenu = ({ menuExpanded }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  return (
    <>
      {menuExpanded &&
        <div className='absolute top-16 right-0 w-full max-w-md'>
          <div className='shadow-lg bg-dial-stratos text-white cursor-pointer'>
            <ul className='flex flex-col max-h-[640px] lg:max-h-full overflow-auto gap-4 p-4'>
              <li className='relative text-right text-lg'>
                <Link href='/dpi-topics' role='menuitem' className={menuStyles}>
                  {format('dpi.header.topic').toUpperCase()}
                </Link>
              </li>
              <li className='relative text-right text-lg'>
                <Link href='/dpi-countries' role='menuitem' className={menuStyles}>
                  {format('dpi.header.country').toUpperCase()}
                </Link>
              </li>
              <li className='relative text-right text-lg'>
                <Link href='/dpi-resource-finder' role='menuitem' className={menuStyles}>
                  {format('dpi.header.resourceFinder').toUpperCase()}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      }
    </>
  )
}

export default DpiMobileMenu
