import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const menuStyles = 'py-3 cursor-pointer border-b border-transparent hover:border-dial-sunshine'

const HealthMobileMenu = ({ menuExpanded }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  return (
    <>
      {menuExpanded &&
        <div className='absolute top-16 right-0 w-full max-w-md'>
          <div className='shadow-lg bg-dial-stratos text-dial-cotton cursor-pointer'>
            <ul className='flex flex-col max-h-[640px] lg:max-h-full overflow-auto gap-4 p-4'>
              <li className='relative text-right text-lg'>
                <Link href='/health/about' role='menuitem' className={menuStyles}>
                  {format('health.header.about').toUpperCase()}
                </Link>
              </li>
              <li className='relative text-right text-lg'>
                <Link href='/health/products' role='menuitem' className={menuStyles}>
                  {format('health.header.products').toUpperCase()}
                </Link>
              </li>
              <li className='relative text-right text-lg'>
                <Link href='/health/faq' role='menuitem' className={menuStyles}>
                  {format('health.header.faq').toUpperCase()}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      }
    </>
  )
}

export default HealthMobileMenu
