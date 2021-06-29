import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const convertBreadcrumb = string => {
  return string
    .replace(/-/g, ' ')
    .replace(/oe/g, 'ö')
    .replace(/ae/g, 'ä')
    .replace(/ue/g, 'ü')
    .toUpperCase()
}

const Breadcrumb = () => {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState(null)
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/')
      linkPath.shift()

      const pathArray = linkPath.map((path, i) => {
        return { breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/') }
      })

      setBreadcrumbs(pathArray)
    }
  }, [router])

  if (!breadcrumbs) {
    return null
  }

  return (
    // Use this to make this sticky: <div className='bg-white sticky py-4' style={{ top: '66px', zIndex: 1 }}>
    <div className='bg-white pb-3 lg:py-4 whitespace-nowrap overflow-ellipsis overflow-hidden'>
      <a className='inline text-dial-blue h5' href='/'>{format('app.home')}</a>
      {breadcrumbs.map((breadcrumb, i) => {
        return (
          <div key={i} className={`inline ${i === breadcrumbs.length - 1 ? 'text-dial-gray-dark' : 'text-dial-blue'} h5`}>
            &nbsp;&gt;&nbsp;
            <Link href={breadcrumb.href}>
              <a>
                {convertBreadcrumb(breadcrumb.breadcrumb)}
              </a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Breadcrumb
