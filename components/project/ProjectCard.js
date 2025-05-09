import { useCallback } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaRegStar, FaStar, FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
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
            {project?.parsedDescription && parse(project?.parsedDescription)}
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
        <hr className='border-b border-dial-slate-400' />
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

  const displayGridCard = () => (
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg'>
      <div className='bg-white border shadow-lg rounded-xl h-[21rem]'>
        <div className="flex flex-col h-full">
          <div
            className={
              classNames(
                'flex justify-center items-center bg-white',
                'rounded-xl border-4 border-dial-violet',
                'py-10 mx-4 my-4 max-h-[12rem]'
              )}
          >
            <div className='flex flex-row gap-4 justify-center items-center'>
              {firstProduct &&
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + firstProduct.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain max-h-[4rem] w-[4rem]"
                />
              }
              {!firstProduct &&
                <img
                  src='/ui/v1/product-header.svg'
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className='object-contain max-h-[4rem] w-[4rem]'
                />
              }
              {firstOrganization &&
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + firstOrganization.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                  className="object-contain max-h-[4rem] w-[4rem]"
                />
              }
              {!firstOrganization &&
                <img
                  src='/ui/v1/organization-header.svg'
                  alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                  className='object-contain max-h-[4rem] w-[4rem]'
                />
              }
            </div>
          </div>
          <div className="px-6 text-xl text-center font-semibold line-clamp-1">
            {project.name}
          </div>
          <div className="px-6 py-2 text-xs text-dial-stratos font-medium">
            <span className="text-center line-clamp-3">
              {project.parsedDescription && parse(project.parsedDescription)}
            </span>
          </div>
          {project.sector &&
            <div className="my-3 mx-auto text-xs font-medium">
              <div className="rounded-full bg-dial-blueberry uppercase shadow-none px-6 py-1 text-white">
                {project.sector?.name}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )

  return (
    <div className='relative'>
      <Link href={`/projects/${project.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
        {displayType === DisplayType.PINNED_CARD && displayPinnedCard()}
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
      </Link>
      <div className='absolute top-2 right-2'>
        <div className='flex flex-row gap-2'>
          {isValidFn(dismissHandler) &&
            <button type='button' className='text-dial-plum' >
              <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
            </button>
          }
          {isValidFn(addStarHandler) && !starred &&
            <button type='button' className='text-dial-plum'>
              <FaRegStar size='1rem' className='text-dial-plum' onClick={addStarHandler} />
            </button>
          }
          {isValidFn(removeStarHandler) && starred &&
            <button type='button' className='text-dial-plum'>
              <FaStar size='1rem' className='text-dial-plum' onClick={removeStarHandler} />
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
