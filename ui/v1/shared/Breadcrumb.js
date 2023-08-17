import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Link from 'next/link'

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
  'cities': 'ui.city.header',
  'contacts': 'ui.contact.header',
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
  'ui.storefronts': 'ui.storefront.header',
  'tags': 'ui.tag.header',
  'users': 'ui.user.header',
  'use-case-steps': 'ui.useCaseStep.header',
  'use-cases': 'ui.useCase.header',
  'workflows': 'ui.workflow.header'
}

const candidatePathMappings = {
  'datasets': 'ui.candidateDataset.header',
  'organizations': 'ui.candidateOrganization.header',
  'products': 'ui.candidateProduct.header',
  'roles': 'ui.candidateRole.header'
}

export const BREADCRUMB_SEPARATOR = <>&nbsp;&gt;&nbsp;</>

const Breadcrumb = ({ slugNameMapping }) => {
  const { locales, pathname, query } = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  useEffect(() => {
    const linkPath = window.location.pathname
      .split('/')
      .filter(path => path)

    let candidatePath = false
    const pathArray = linkPath
      .map((path, i) => {
        if (locales.indexOf(path) >= 0) {
          return {}
        }

        if (path.indexOf('candidate') >= 0) {
          candidatePath = true

          return {}
        }

        const label = !candidatePath && basePathMappings[path]
          ? format(basePathMappings[path])
          : candidatePath && candidatePathMappings[path]
            ? format(candidatePathMappings[path])
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
    <div className='whitespace-nowrap text-ellipsis overflow-hidden'>
      <Link href='/' className='h5'>
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
