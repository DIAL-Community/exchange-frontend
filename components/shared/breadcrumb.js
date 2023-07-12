import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useIntl } from 'react-intl'

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
  use_cases: 'useCase.header',
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

const Breadcrumb = (props) => {
  const { slugNameMapping } = props

  const { asPath } = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  useEffect(() => {
    const linkPath = asPath.split('/')
    linkPath.shift()

    const pathArray = linkPath.map((path, i) => {
      const userFriendlyPath = basePathMappings[path] ? format(basePathMappings[path]) : slugNameMapping[path]

      return { breadcrumb: userFriendlyPath, href: '/' + linkPath.slice(0, i + 1).join('/') }
    })

    setBreadcrumbs(pathArray)
  }, [slugNameMapping])

  if (!breadcrumbs) {
    return null
  }

  return (
    // Use this to make this sticky: <div className='bg-white sticky py-4' style={{ top: '66px', zIndex: 1 }}>
    <div className='bg-white pb-3 lg:py-4 whitespace-nowrap text-ellipsis overflow-hidden'>
      <Link href='/' className='inline text-dial-sapphire h5'>
        {format('app.home')}
      </Link>
      {breadcrumbs.map((breadcrumb, i) => {
        return (
          <div key={i} className='inline h5'>
            {BREADCRUMB_SEPARATOR}
            <Link
              href={breadcrumb.href}
              className={`${i === breadcrumbs.length - 1 ? 'text-dial-gray-dark' : 'text-dial-sapphire'}`}
            >
              {convertBreadcrumb(breadcrumb.breadcrumb)}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Breadcrumb
