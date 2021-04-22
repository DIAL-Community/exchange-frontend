import Link from 'next/link'
import { useIntl } from 'react-intl'

const ProjectCard = ({ project, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

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

  return (
    <Link className='card-link' href={`/projects/${project.slug}`}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-button-gray hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-5 px-4 text-base font-semibold text-dial-gray-dark whitespace-nowrap overflow-ellipsis overflow-hidden'>
                  <div className='col-span-3 md:col-span-4 lg:col-span-5 mr-4 overflow-hidden overflow-ellipsis'>
                    {project.name}
                  </div>
                  <div className='col-span-3 md:col-span-3 lg:col-span-3 mr-4 overflow-hidden overflow-ellipsis'>
                    {
                      project.organizations && project.organizations.length === 0 && format('general.na')
                    }
                    {
                      project.organizations && project.organizations.length > 0 &&
                        project.organizations.map(o => o.name).join(', ')
                    }
                  </div>
                  <div className='col-span-3 md:col-span-3 lg:col-span-2 mr-4 overflow-hidden overflow-ellipsis'>
                    {
                      project.products && project.products.length === 0 && format('general.na')
                    }
                    {
                      project.products && project.products.length > 0 &&
                        project.products.map(p => p.name).join(', ')
                    }
                  </div>
                  <div className='col-span-3 md:col-span-2'>
                    <img
                      className='h-6 md:h-8'
                      src={`/images/origins/${project.origin.slug}.png`}
                      alt={project.origin.slug}
                    />
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='group border-3 border-transparent hover:border-dial-yellow text-dial-purple cursor-pointer'>
              <div className='h-full flex flex-col border border-dial-gray hover:border-dial-yellow shadow-lg hover:shadow-2xl'>
                <div className='border-b text-2xl p-4 group-hover:text-dial-yellow' style={{ minHeight: '97px' }}>
                  <div className='overflow-hidden overflow-ellipsis' style={{ maxHeight: '64px' }}>
                    {project.name}
                  </div>
                </div>
                <div className='flex flex-row h-64'>
                  <div className='flex-grow flex flex-col p-4'>
                    <div className='flex flex-col absolute w-40'>
                      <div className='text-base'>Organizations</div>
                      <div className={`font-semibold whitespace-wrap bg-white bg-opacity-70 ${!projectOrganization ? 'opacity-30' : ''}`}>
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
                              alt={`Logo for ${projectOrganization.name}`}
                              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + projectOrganization.imageFile}
                            />
                            )
                      }
                    </div>
                  </div>
                  <div className='flex-grow flex flex-col border-l p-4'>
                    <div className='flex flex-col absolute w-40 px-4'>
                      <div className='text-base'>Products</div>
                      <div className={`font-semibold whitespace-wrap bg-white bg-opacity-70 ${!projectProduct ? 'opacity-30' : ''}`}>
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
                              alt={`Logo for ${projectProduct.name}`}
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
                    <div className='mx-6 bg-white p-2 rounded'>
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
    </Link>
  )
}

export default ProjectCard
