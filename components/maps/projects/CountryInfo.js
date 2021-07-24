import { useRouter } from 'next/router'
import { useState } from 'react'
import { useIntl } from 'react-intl'

const CountryInfo = (props) => {
  const { country } = props
  // Just return empty fragment when there's no country selected.
  if (!country) {
    return null
  }

  const router = useRouter()
  const [active, setActive] = useState(country.projects[0].slug)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const openDetailPage = (e, slug) => {
    e.preventDefault()
    router.push(`/projects/${slug}`)
  }

  const toggleExpand = (e, slug) => {
    e.preventDefault()
    setActive(active === slug ? 'undefined' : slug)
  }

  return (
    <div className='absolute left-4 md:left-auto right-4' style={{ zIndex: 19, minWidth: '20ch' }}>
      <div className='block mt-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-w-prose overflow-auto max-h-96'>
        <div className='text-sm text-dial-cyan font-semibold border-b px-4 py-2'>
          {`${country.projects.length} ${format('project.header')} in ${country.name}`}
        </div>
        {
          country && country.projects.map(project => {
            return (
              <div key={`${country.name}-${project.name}`} className='hover:bg-gray-100 hover:text-gray-900'>
                <div className='mx-4 py-2 border-b last:border-0'>
                  <a
                    href={`expand-${project.slug}`} onClick={(e) => toggleExpand(e, project.slug)}
                    className={`${active === project.slug ? 'font-semibold' : ''} text-sm text-gray-700 cursor-pointer block`}
                  >
                    {project.name}
                  </a>
                  {
                    active === project.slug &&
                      <>
                        <a
                          href={project.slug} onClick={(e) => openDetailPage(e, project.slug)}
                          className='block py-1.5 text-center text-xs text-dial-blue bg-dial-blue-light bg-opacity-20 cursor-pointer'
                        >
                          {format('map.projects.viewProject')} &gt;&gt;
                        </a>
                      </>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default CountryInfo
