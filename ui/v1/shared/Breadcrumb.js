import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import { REBRAND_BASE_PATH } from '../utils/constants'

const convertBreadcrumb = string => {
  return string
    ? string
      .replace(/-/g, ' ')
      .replace(/oe/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/ue/g, 'ü')
      .toUpperCase()
    : string
}

const basePathMappings = {
  'building-blocks': 'ui.buildingBlock.header',
  'countries': 'ui.country.header',
  'datasets': 'ui.dataset.header',
  'moves': 'ui.move.header',
  'opportunities': 'ui.opportunity.header',
  'organizations': 'ui.organization.header',
  'playbooks': 'ui.playbook.header',
  'plays': 'ui.play.header',
  'products': 'ui.product.header',
  'projects': 'ui.project.header',
  'repositories': 'productRepository.header',
  'resources': 'ui.resource.header',
  'rubric-categories': 'ui.rubricCategories.header',
  'sdgs': 'ui.sdg.header',
  'sectors': 'ui.sector.header',
  'storefronts': 'ui.storefront.header',
  'tags': 'ui.tag.header',
  'users': 'ui.user.header',
  'use-case-steps': 'ui.useCaseStep.header',
  'use-cases': 'ui.useCase.header',
  'workflows': 'ui.workflow.header',
  'candidate': 'ui.candidate.header'
}

export const BREADCRUMB_SEPARATOR = <>&nbsp;&gt;&nbsp;</>

const Breadcrumb = ({ slugNameMapping }) => {
  const { pathname, query } = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  useEffect(() => {
    const linkPath = window.location.pathname
      .replace(REBRAND_BASE_PATH, '')
      .split('/')
      .filter(path => path)

    const pathArray = linkPath
      .map((path, i) => {
        const label = basePathMappings[path]
          ? format(basePathMappings[path])
          : slugNameMapping[path]

        return {
          breadcrumb: label,
          href: `${REBRAND_BASE_PATH}/${linkPath.slice(0, i + 1).join('/')}`
        }
      })

    setBreadcrumbs(pathArray)
  }, [slugNameMapping, pathname, query, format])

  if (!breadcrumbs) {
    return null
  }

  return (
    <div className='whitespace-nowrap text-ellipsis overflow-hidden'>
      <Link href='/ui/v1/' className='h5'>
        {format('app.home')}
      </Link>
      {breadcrumbs.map((breadcrumb, i) => {
        return (
          <div key={i} className='inline h5'>
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

export default Breadcrumb
