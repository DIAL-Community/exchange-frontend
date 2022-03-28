import Link from 'next/link'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
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

  const nameColSpan = (project) => {
    return !project.organizations && !project.products
      ? 'col-span-12 lg:col-span-10 xl:col-span-9'
      : 'col-span-12 lg:col-span-5 xl:col-span-4'
  }

  const originColSpan = (project) => {
    return !project.organizations && !project.products
      ? 'hidden lg:block lg:col-span-2 xl:col-span-3'
      : 'hidden lg:block lg:col-span-1 xl:col-span-2'
  }

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const navClickHandler = () => {
  }

  return (
    <Link className='card-link' href={`/${collectionPath}/${project.slug}`}>
      <a {... newTab && { target: '_blank' }}>
        {
          listType === 'list'
            ? (
              <div onClick={() => navClickHandler()} className={containerElementStyle}>
                <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='grid grid-cols-12 my-4 px-4 text-base font-semibold hover:text-dial-yellow'>
                    <div className={`${nameColSpan(project)} lg:mr-4 my-auto ${ellipsisTextStyle}`}>
                      <div className='block lg:hidden font-normal float-right'>
                        <div
                          className='block xl:hidden text-right'
                          data-tip={format('tooltip.forEntity', { entity: format('origin.label'), name: project.origin.name })}
                        >
                          {(ORIGIN_ACRONYMS[project.origin.slug.toLowerCase()] || project.origin.slug).toUpperCase()}
                        </div>
                      </div>
                      {project.name}
                      {
                        project.organizations &&
                        <div className='block lg:hidden flex flex-row mt-1'>
                          <div className='text-sm font-normal'>
                            {format('organization.header')}:
                          </div>
                          <div className={`mx-1 text-sm font-normal ${ellipsisTextStyle}`}>
                            {
                              project.organizations.length === 0 && format('general.na')
                            }
                            {
                              project.organizations.length > 0 &&
                              project.organizations.map(o => o.name).join(', ')
                            }
                          </div>
                        </div>
                      }
                      {
                        project.products &&
                        <div className='block lg:hidden flex flex-row mt-1'>
                          <div className='text-sm font-normal'>
                            {format('product.header')}:
                          </div>
                          <div className='mx-1 text-sm font-normal overflow-hidden text-ellipsis'>
                            {
                              project.products.length === 0 && format('general.na')
                            }
                            {
                              project.products.length > 0 &&
                                project.products.map(p => p.name).join(', ')
                            }
                          </div>
                        </div>
                      }
                    </div>
                    {
                      project.organizations &&
                      <div className={`hidden lg:block lg:col-span-3 mr-4 font-normal ${ellipsisTextStyle}`}>
                        {
                          project.organizations.length === 0 && format('general.na')
                        }
                        {
                          project.organizations.length > 0 &&
                            project.organizations.map(o => o.name).join(', ')
                        }
                      </div>
                    }
                    {
                      project.products &&
                      <div className={`hidden lg:block lg:col-span-3 mr-4 font-normal ${ellipsisTextStyle}`}>
                        {
                          project.products.length === 0 && format('general.na')
                        }
                        {
                          project.products.length > 0 &&
                            project.products.map(p => p.name).join(', ')
                        }
                      </div>
                    }
                    <div className={`${originColSpan(project)} font-normal`}>
                      <img
                        className='hidden xl:block h-6 ml-auto'
                        src={`/images/origins/${project.origin.slug}.png`}
                        alt={project.origin.slug}
                      />
                      <div
                        className='block xl:hidden text-right'
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
              <div onClick={() => navClickHandler()} className={`group ${containerElementStyle}`}>
                <div className='h-full flex flex-col border border-dial-gray hover:border-dial-yellow card-drop-shadow'>
                  <div className='border-b text-2xl p-4 group-hover:text-dial-yellow' style={{ minHeight: '97px' }}>
                    <div className='text-xl 2xl:text-2xl' style={{ maxHeight: '64px' }}>
                      {truncate(project.name, 50, true, true)}
                    </div>
                  </div>
                  <div className='flex flex-row h-64'>
                    <div className='flex-grow flex flex-col p-4'>
                      <div className='flex flex-col absolute w-40'>
                        <div className='text-base'>{format('organization.header')}</div>
                        <div className={`font-semibold whitespace-wrap ${!projectOrganization ? 'opacity-30' : ''}`}>
                          {
                            !projectOrganization ? format('general.na') : projectOrganization.name
                          }
                        </div>
                      </div>
                      <div className='m-auto w-32'>
                        {
                          !projectOrganization
                            ? (
                              <img
                                className='object-cover object-center opacity-30 mx-auto'
                                alt='Placeholder logo for organization.'
                                src='/images/placeholders/organization.png'
                              />)
                            : (
                              <img
                                className='object-cover object-center mx-auto'
                                alt={format('image.alt.logoFor', { name: projectOrganization.name })}
                                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + projectOrganization.imageFile}
                              />
                            )
                        }
                      </div>
                    </div>
                    <div className='flex-grow flex flex-col border-l p-4'>
                      <div className='flex flex-col absolute w-40 px-4'>
                        <div className='text-base'>{format('product.header')}</div>
                        <div className={`font-semibold whitespace-wrap ${!projectProduct ? 'opacity-30' : ''}`}>
                          {
                            !projectProduct ? format('general.na') : projectProduct.name
                          }
                        </div>
                      </div>
                      <div className='m-auto w-32'>
                        {
                          !projectProduct
                            ? (
                              <img
                                className='object-cover object-center opacity-30 mx-auto'
                                alt='Placeholder logo for product'
                                src='/images/placeholders/product.png'
                              />)
                            : (
                              <img
                                className='object-cover object-center mx-auto'
                                alt={format('image.alt.logoFor', { name: projectProduct.name })}
                                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + projectProduct.imageFile}
                              />
                            )
                        }
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
