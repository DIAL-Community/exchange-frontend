import { useCallback } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const WorkflowCard = ({ displayType, index, workflow, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {workflow.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-16 h-16 mx-auto bg-dial-plum rounded-full'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.workflow.label') })}
              className='object-contain w-8 h-8 mx-auto mt-4 white-filter'
            />
          </div>
        }
        {workflow.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20 mx-auto'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.workflow.label') })}
              className='object-contain w-16 h-16'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {workflow.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {workflow?.parsedDescription && parse(workflow?.parsedDescription)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.useCase.header')} ({workflow.useCases?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({workflow.buildingBlocks?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {workflow.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full bg-dial-plum w-10 h-10 my-auto min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.workflow.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {workflow.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='rounded-full bg-dial-plum w-10 h-10 my-auto min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.workflow.header') })}
              className='object-contain w-6 h-6 mx-auto mt-2 white-filter'
            />
          </div>
        }
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {workflow.name}
        </div>
      </div>
    </div>

  const displayGridCard = () => (
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg'>
      <div className='bg-white border shadow-lg rounded-xl h-[22rem]'>
        <div className="flex flex-col h-full">
          <div
            className={
              classNames(
                'flex justify-center items-center bg-white',
                'rounded-xl border-4 border-dial-violet',
                'py-12 mx-4 my-4 max-h-[10rem]'
              )}
          >
            {workflow.imageFile.indexOf('placeholder.svg') < 0 &&
              <div className="inline my-4 mx-6">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain h-10 w-[5rem]"
                />
              </div>
            }
            {workflow.imageFile.indexOf('placeholder.svg') >= 0 &&
              <div className="w-20 h-20 flex justify-center items-center">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className='object-contain w-10 h-10 mx-auto'
                />
              </div>
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold line-clamp-1">
            {workflow.name}
          </div>
          <div className="px-6 py-2 text-xs text-dial-stratos font-medium">
            <span className="text-center line-clamp-3">
              {workflow?.parsedDescription && parse(workflow?.parsedDescription)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='relative'>
      <Link href={`/workflows/${workflow.slug}`}>
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      {isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default WorkflowCard
