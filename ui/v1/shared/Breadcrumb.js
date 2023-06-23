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
  sdgs: 'sdg.header',
  'use-cases': 'useCase.header',
  use_case_steps: 'useCaseStep.header',
  workflows: 'workflow.header',
  building_blocks: 'building-block.header',
  products: 'product.header',
  datasets: 'dataset.header',
  repositories: 'productRepository.header',
  projects: 'project.header',
  organizations: 'organization.header',
  playbooks: 'playbook.header',
  plays: 'play.header',
  users: 'user.header',
  moves: 'move.header',
  countries: 'country.header',
  rubric_categories: 'rubric-categories.header',
  opportunities: 'opportunity.header',
  resources: 'resource.header',
  storefronts: 'storefront.header'
}

export const BREADCRUMB_SEPARATOR = <>&nbsp;&gt;&nbsp;</>

const Breadcrumb = ({ slugNameMapping }) => {
  const { asPath } = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  useEffect(() => {
    const linkPath = asPath.replace(REBRAND_BASE_PATH, '').split('/')
    const pathArray = linkPath.map((path, i) => {
      const label = basePathMappings[path] ? format(basePathMappings[path]) : slugNameMapping[path]

      return { breadcrumb: label, href: `${REBRAND_BASE_PATH}${linkPath.slice(0, i + 1).join('/')}` }
    })

    setBreadcrumbs(pathArray)
  }, [slugNameMapping, asPath, format])

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
