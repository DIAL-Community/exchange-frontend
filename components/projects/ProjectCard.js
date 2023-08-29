import Link from 'next/link'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { convertToKey } from '../context/FilterContext'
import { ORIGIN_ACRONYMS } from '../../lib/constants'
const collectionPath = convertToKey('Projects')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const ProjectCard = ({ project, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const projectOrganization = (() => {
    if (project.organizations && project.organizations.length > 0) {
      const [organization] = project.organizations

      return organization
    }
  })()

  const projectProduct = (() => {
    if (project.products && project.products.length > 0) {
      const [product] =  project.products

      return product
    }
  })()

  const defaultProductImage = '/images/placeholders/product.png'
  const defaultOrganizationImage = '/images/placeholders/organization.png'

  const listDisplayType = () =>
    <div className={`${containerElementStyle}`}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='relative flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
          <div className='w-10/12 lg:w-4/12 flex text-dial-gray-dark my-auto'>
            <div className='text-dial-sapphire font-semibold line-clamp-1'>
              {project.name}
            </div>
          </div>
          {
            project.organizations &&
              <div className='w-4/12 lg:w-3/12 text-sm line-clamp-1'>
                {project.organizations.length === 0 && format('general.na')}
                {project.organizations.length > 0 && project.organizations.map(o => o.name).join(', ')}
              </div>
          }
          {
            project.products &&
              <div className='w-4/12 lg:w-3/12 text-sm line-clamp-1'>
                {project.products.length === 0 && format('general.na')}
                {project.products.length > 0 && project.products.map(p => p.name).join(', ')}
              </div>
          }
          <div className='absolute top-4 lg:top-1/3 right-4'>
            <div
              className='text-right text-sm font-semibold text-dial-cyan'
              data-tooltip-content={format(
                'tooltip.forEntity',
                { entity: format('origin.label'), name: project.origin.name }
              )}
              data-tooltip-id='react-tooltip'
              data-tooltip-place='left'
            >
              {(ORIGIN_ACRONYMS[project.origin.slug.toLowerCase()] || project.origin.slug).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>

  const cardDisplayType = () =>
    <div className={containerElementStyle}>
      <div
        className={classNames(
          'bg-white shadow-lg rounded-lg h-full',
          'border border-dial-gray hover:border-transparent'
        )}
      >
        <div className='flex flex-col'>
          <div className='flex text-dial-sapphire bg-dial-alice-blue h-20 rounded-t-lg'>
            <div className='px-4 text-sm text-center font-semibold m-auto line-clamp-2'>
              {project.name}
            </div>
          </div>
          <div className='flex h-44'>
            <div className='flex-col w-1/2 p-4 text-sm'>
              <div className=''>{format('ui.organization.header')}</div>
              <div className='font-semibold opacity-30 line-clamp-1'>
                {projectOrganization
                  ? projectOrganization.name
                  : format('general.na')
                }
              </div>
              <div className='py-2'>
                <img
                  className='object-contain h-20 mx-auto'
                  layout='fill'
                  alt={format(
                    'image.alt.logoFor',
                    { name: projectOrganization ? projectOrganization.name : format('ui.organization.label') }
                  )}
                  src={projectOrganization
                    ? process.env.NEXT_PUBLIC_GRAPHQL_SERVER + projectOrganization.imageFile
                    : defaultOrganizationImage
                  }
                />
              </div>
            </div>
            <div className='flex-col w-1/2 p-4 text-sm border-l'>
              <div className=''>{format('ui.product.header')}</div>
              <div className='font-semibold opacity-30 line-clamp-1'>
                {projectProduct ? projectProduct.name : format('general.na')}
              </div>
              <div className='py-2'>
                <img
                  className='object-contain h-20 mx-auto'
                  layout='fill'
                  alt={format(
                    'image.alt.logoFor',
                    { name: projectProduct ? projectProduct.name : format('ui.product.label') }
                  )}
                  src={projectProduct
                    ? process.env.NEXT_PUBLIC_GRAPHQL_SERVER + projectProduct.imageFile
                    : defaultProductImage
                  }
                />
              </div>
            </div>
          </div>
          <div className='mt-auto bg-dial-gray-light border-t border-dial-gray p-4 text-sm'>
            <div className='flex flex-row'>
              <div className='my-auto'>Source</div>
              <div className='mx-6 p-2 rounded'>
                <img
                  className='h-6'
                  src={`/images/origins/${project.origin.slug}.png`}
                  alt={project.origin.slug}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    !newTab
      ? <Link href={`/${collectionPath}/${project.slug}`}>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </Link>
      : <a href={`/${collectionPath}/${project.slug}`} target='_blank' rel='noreferrer' role='menuitem'>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </a>
  )
}

export default ProjectCard
