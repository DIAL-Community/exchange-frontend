import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark, FaRegStar, FaStar } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const ProjectCard = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    index,
    project,
    starred,
    displayType,
    dismissHandler,
    addStarHandler,
    removeStarHandler
  } = props

  const [firstProduct] = project?.products ?? []
  const [firstOrganization] = project?.organizations ?? []

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-row gap-x-6'>
        <div className='flex flex-col gap-y-4'>
          {firstProduct &&
            <div className='w-20 h-20 mx-auto bg-white border'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + firstProduct.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                className='object-contain w-16 h-16 mx-auto mt-2'
              />
            </div>
          }
          {!firstProduct &&
            <div className='w-16 h-16 mx-auto rounded-full'>
              <img
                src='/ui/v1/product-header.svg'
                alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                className='object-contain w-16 h-16 mx-auto mt-2'
              />
            </div>
          }
          {firstOrganization &&
            <div className='w-20 h-20 mx-auto bg-white border'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + firstOrganization.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className='object-contain w-16 h-16 mx-auto mt-2'
              />
            </div>
          }
          {!firstOrganization &&
            <div className='w-20 h-20 mx-auto bg-dial-blueberry'>
              <img
                src='/ui/v1/organization-header.svg'
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className='object-contain w-10 h-10 mx-auto mt-4 white-filter'
              />
            </div>
          }
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl'>
          <div className='text-lg font-semibold text-dial-plum'>
            {project.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {project?.projectDescription && parse(project?.projectDescription.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.organization.header')} ({project.organizations?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.product.header')} ({project.products?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.sdg.header')} ({project.sdgs?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='flex flex-row gap-3 items-center'>
          {firstProduct &&
            <div className='w-10 h-10 mx-auto bg-white border'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + firstProduct.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                className='object-contain w-8 h-8 mx-auto'
              />
            </div>
          }
          {!firstProduct &&
            <div className='w-10 h-10 mx-auto'>
              <img
                src='/ui/v1/product-header.svg'
                alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                className='object-contain mx-auto'
              />
            </div>
          }
          {firstOrganization &&
            <div className='w-10 h-10 mx-auto bg-white border'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + firstOrganization.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className='object-contain w-8 h-8 mx-auto'
              />
            </div>
          }
          {!firstOrganization &&
            <div className='w-10 h-10 mx-auto bg-dial-blueberry'>
              <img
                src='/ui/v1/organization-header.svg'
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className='object-contain w-6 h-6 mx-auto mt-2 white-filter'
              />
            </div>
          }
        </div>
        <div className='text-sm font-semibold text-dial-stratos line-clamp-1 my-auto pr-4'>
          {project.name}
        </div>
      </div>
    </div>

  const displayPinnedCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg'>
      <div className='flex flex-col gap-3 px-3 py-6'>
        <div className='text-sm font-semibold text-dial-stratos my-auto line-clamp-2'>
          <div className='pl-4 pr-6'>
            {project.name}
          </div>
        </div>
        <hr className='border-b border-dial-slate-400'/>
        <div className='flex flex-row gap-3'>
          {firstProduct &&
            <div className='w-20 h-20 mx-auto bg-white border'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + firstProduct.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                className='object-contain w-16 h-16 mx-auto my-2'
              />
            </div>
          }
          {!firstProduct &&
            <div className='w-20 h-20 mx-auto'>
              <img
                src='/ui/v1/product-header.svg'
                alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                className='object-contain mx-auto mt-2'
              />
            </div>
          }
          <div className='border-r border-dial-slate-500' />
          {firstOrganization &&
            <div className='w-20 h-20 mx-auto bg-white border'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + firstOrganization.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className='object-contain w-16 h-16 mx-auto my-2'
              />
            </div>
          }
          {!firstOrganization &&
            <div className='w-20 h-20 mx-auto bg-dial-blueberry'>
              <img
                src='/ui/v1/organization-header.svg'
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className='object-contain w-10 h-10 mx-auto mt-4 white-filter'
              />
            </div>
          }
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/projects/${project.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
        {displayType === DisplayType.PINNED_CARD && displayPinnedCard()}
      </Link>
      <div className='absolute p-3 top-3 right-2'>
        <div className='flex flex-row gap-2'>
          { isValidFn(dismissHandler) &&
            <button type='button'className='text-dial-plum' >
              <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
            </button>
          }
          { isValidFn(addStarHandler) && !starred &&
            <button type='button'className='text-dial-plum'>
              <FaRegStar size='1rem' className='text-dial-plum' onClick={addStarHandler} />
            </button>
          }
          { isValidFn(removeStarHandler) && starred &&
            <button type='button'className='text-dial-plum'>
              <FaStar size='1rem' className='text-dial-plum' onClick={removeStarHandler} />
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
