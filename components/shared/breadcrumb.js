import React, { useEffect, useState } from 'react'
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
  repositories: 'productRepository.header',
  projects: 'project.header',
  organizations: 'organization.header'
}

const Breadcrumb = (props) => {
  const { slugNameMapping } = props

  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState(null)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  useEffect(() => {
    const linkPath = router.asPath.split('/')
    linkPath.shift()

    const pathArray = linkPath.map((path, i) => {
      const userFriendlyPath = basePathMappings[path] ? format(basePathMappings[path]) : slugNameMapping[path]
      return { breadcrumb: userFriendlyPath, href: '/' + linkPath.slice(0, i + 1).join('/') }
    })
    
    setBreadcrumbs(pathArray)
  }, [router, slugNameMapping.timeStamp])

  if (!breadcrumbs) {
    return null
  }

  return (
    // Use this to make this sticky: <div className='bg-white sticky py-4' style={{ top: '66px', zIndex: 1 }}>
    <div className='bg-white pb-3 lg:py-4 whitespace-nowrap overflow-ellipsis overflow-hidden'>
      <Link href='/'>
        <a className='inline text-dial-blue h5'>{format('app.home')}</a>
      </Link>
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
