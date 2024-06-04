import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

const convertBreadcrumb = string => {
  return string
    ? string
      .replace(/-/g, ' ')
      .replace(/oe/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/ue/g, 'ü')
    : string
}

const basePathMappings = {
  'dpi-countries': 'dpi.breadcrumb.country',
  'dpi-topics': 'dpi.breadcrumb.topic',
  'dpi-dashboard': 'dpi.breadcrumb.dashboard',
  'dpi-resource-finder': 'dpi.breadcrumb.resourceFinder',
  'dpi-curriculum': 'dpi.breadcrumb.curriculum',
  'dpi-curriculum-module': 'dpi.breadcrumb.curriculumModule',
  'dpi-curriculum-sub-module': 'dpi.breadcrumb.curriculumSubModule'
}

export const BREADCRUMB_SEPARATOR = <>&nbsp;&gt;&nbsp;</>

const DpiBreadcrumb = ({ slugNameMapping }) => {
  const { locales, pathname, query } = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  useEffect(() => {
    const linkPath = window.location.pathname
      .split('/')
      .filter(path => path)

    const pathArray = linkPath
      .map((path, i) => {
        if (locales.indexOf(path) >= 0) {
          return {}
        }

        const label = basePathMappings[path]
          ? format(basePathMappings[path])
          : slugNameMapping[path]

        return {
          breadcrumb: label,
          href: `/${linkPath.slice(0, i + 1).join('/')}`
        }
      })
      .filter(path => path.breadcrumb && path.href)

    setBreadcrumbs(pathArray)
  }, [slugNameMapping, pathname, query, locales, format])

  if (!breadcrumbs) {
    return null
  }

  return (
    <div className='whitespace-nowrap text-ellipsis overflow-hidden text-sm'>
      <Link href='/' className='inline'>
        {format('app.home')}
      </Link>
      {breadcrumbs.map((breadcrumb, i) => {
        return (
          <div key={i} className='inline'>
            {BREADCRUMB_SEPARATOR}
            <Link href={breadcrumb.href}>
              {convertBreadcrumb(breadcrumb.breadcrumb)}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default DpiBreadcrumb
