import Link from 'next/link'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import Image from 'next/image'
import { ORIGIN_ACRONYMS, truncate } from '../../lib/utilities'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Projects')

const ellipsisTextStyle = `
  whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
`

const ProjectCard = ({ project, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const projectOrganization = (() => {
    if (project.organizations && project.organizations.length > 0) {
      return project.organizations[0]
    }
  })()

  const projectProduct = (() => {
    if (project.products && project.products.length > 0) {
      return project.products[0]
    }
  })()

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <Link className='card-link' href={`/${collectionPath}/${project.slug}`}>
      <a {... newTab && { target: '_blank' }}>
        {
          listType === 'list'
            ? (
              <div className={containerElementStyle}>
                <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 justify-between' style={{ minHeight: '4.5rem' }}>
                    <div className={`w-10/12 lg:w-3/12 my-auto font-semibold ${ellipsisTextStyle}`}>
                      {project.name}
                    </div>
                    {
                      project.organizations &&
                        <div className={`w-4/12 lg:w-3/12 text-sm lg:text-base ${ellipsisTextStyle}`}>
                          {project.organizations.length === 0 && format('general.na')}
                          {project.organizations.length > 0 && project.organizations.map(o => o.name).join(', ')}
                        </div>
                    }
                    {
                      project.products &&
                        <div className={`w-4/12 lg:w-3/12 text-sm lg:text-base ${ellipsisTextStyle}`}>
                          {project.products.length === 0 && format('general.na')}
                          {project.products.length > 0 && project.products.map(p => p.name).join(', ')}
                        </div>
                    }
                    <div className='top-2 lg:top-1/3 right-3 lg:right-4 text-base lg:justify-end self-center'>
                      <img
                        className='hidden xl:block h-6 ml-auto'
                        src={`/images/origins/${project.origin.slug}.png`}
                        alt={project.origin.slug}
                      />
                      <div
                        className='block xl:hidden text-right text-sm font-semibold text-dial-cyan'
                        data-tip={format('tooltip.forEntity', { entity: format('origin.label'), name: project.origin.name })}
                      >
                        {(ORIGIN_ACRONYMS[project.origin.slug.toLowerCase()] || project.origin.slug).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
              <div className={`group ${containerElementStyle}`}>
                <div className='h-full flex flex-col border border-dial-gray hover:border-dial-yellow card-drop-shadow'>
                  <div className='border-b text-2xl p-4 group-hover:text-dial-yellow' style={{ minHeight: '97px' }}>
                    <div className='text-xl 2xl:text-2xl' style={{ maxHeight: '64px' }}>
                      {truncate(project.name, 50, true, true)}
                    </div>
                  </div>
                  <div className='flex flex-col h-64'>
                    <div className='flex'>
                      <div className='flex-col flex-grow w-40 p-4'>
                        <div className='text-base'>{format('organization.header')}</div>
                        <div className={`font-semibold whitespace-wrap ${!projectOrganization ? 'opacity-30' : ''}`}>
                          {
                            !projectOrganization ? format('general.na') : truncate(projectOrganization.name, 40, true, true)
                          }
                        </div>
                      </div>
                      <div className='flex-col flex-grow w-40 p-4 border-l'>
                        <div className='text-base'>{format('product.header')}</div>
                        <div className={`font-semibold whitespace-wrap ${!projectProduct ? 'opacity-30' : ''}`}>
                          {
                            !projectProduct ? format('general.na') : projectProduct.name
                          }
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-grow'>
                      <div className='flex flex-grow'>
                        <div className='w-32 m-auto'>
                          {
                            !projectOrganization
                              ? (
                                <Image
                                  layout='fill'
                                  objectFit='scale-down'
                                  objectPosition='20%'
                                  className='opacity-30'
                                  alt='Placeholder logo for organization.'
                                  src='/images/placeholders/organization.png'
                                />)
                              : (
                                <Image
                                  layout='fill'
                                  objectFit='scale-down'
                                  objectPosition='20%'
                                  sizes='5vw'
                                  alt={format('image.alt.logoFor', { name: projectOrganization.name })}
                                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + projectOrganization.imageFile}
                                />
                              )
                          }
                        </div>
                      </div>
                      <div className='flex flex-grow border-l'>
                        <div className='w-32 m-auto'>
                          {
                            !projectProduct
                              ? (
                                <Image
                                  layout='fill'
                                  objectFit='scale-down'
                                  objectPosition='80%'
                                  className='opacity-30'
                                  alt='Placeholder logo for product'
                                  src='/images/placeholders/product.png'
                                />)
                              : (
                                <Image
                                  layout='fill'
                                  objectFit='scale-down'
                                  objectPosition='80%'
                                  sizes='5vw'
                                  alt={format('image.alt.logoFor', { name: projectProduct.name })}
                                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + projectProduct.imageFile}
                                />
                              )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-auto bg-dial-gray-light border-t border-dial-gray p-4'>
                    <div className='flex flex-row'>
                      <div className='my-auto'>Source</div>
                      <div className='mx-6 p-2 rounded'>
                        <img
                          className='h-6 md:h-8'
                          src={`/images/origins/${project.origin.slug}.png`}
                          alt={project.origin.slug}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        }
      </a>
    </Link>
  )
}

export default ProjectCard
