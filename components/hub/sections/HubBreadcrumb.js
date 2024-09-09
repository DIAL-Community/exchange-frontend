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
  'countries': 'hub.breadcrumb.country',
  'topics': 'hub.breadcrumb.topic',
  'dashboard': 'hub.breadcrumb.dashboard',
  'resource-finder': 'hub.breadcrumb.resourceFinder',
  'curriculum': 'hub.breadcrumb.curriculum',
  'module': 'hub.breadcrumb.curriculumModule',
  'submodule': 'hub.breadcrumb.curriculumSubModule'
}

export const BREADCRUMB_SEPARATOR = <>&nbsp;&gt;&nbsp;</>

const HubBreadcrumb = ({ slugNameMapping }) => {
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

        /*
          Path labeling resolution ordering:
            - Override from slugNameMapping
            - Override from basePathMappings
            - Fallback to slugNameMapping
        */
        const label = slugNameMapping && slugNameMapping[path]
          ? format(slugNameMapping[path])
          : basePathMappings[path]
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

export default HubBreadcrumb
