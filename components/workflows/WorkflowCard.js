import Link from 'next/link'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Workflows')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const WorkflowCard = ({ workflow, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  // Get associated use cases through use case steps.
  const useCases = (() => {
    if (!workflow.useCaseSteps) {
      return
    }

    const useCases = []
    workflow.useCaseSteps.map(useCaseStep => {
      const useCaseSlugs = useCases.map(u => u.slug)
      if (useCaseSlugs.indexOf(useCaseStep.useCase.slug) === -1) {
        useCases.push(useCaseStep.useCase)
      }

      return useCaseStep
    })

    return useCases
  })()

  return (
    <Link href={`/${collectionPath}/${workflow.slug}`}>
      {
        listType === 'list'
          ? (
            <div className={containerElementStyle}>
              <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
                <div className='flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
                  <div className='w-10/12 lg:w-4/12 flex gap-2 my-auto text-dial-sapphire'>
                    <div className='block w-8 relative opacity-60'>
                      <Image
                        layout='fill'
                        objectFit='scale-down'
                        objectPosition='left'
                        alt={format('image.alt.logoFor', { name: workflow.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
                      />
                    </div>
                    <div className='w-full font-semibold'>
                      {workflow.name}
                    </div>
                  </div>
                  <div className='w-8/12 lg:w-4/12 line-clamp-1'>
                    {useCases?.length === 0 && format('general.na')}
                    {useCases?.length > 0 && useCases.map(u => u.name).join(', ')}
                  </div>
                  <div className='w-8/12 lg:w-3/12 line-clamp-1'>
                    {workflow?.buildingBlocks?.length === 0 && format('general.na')}
                    {
                      workflow?.buildingBlocks?.length > 0 &&
                        workflow.buildingBlocks.map(b => b.name).join(', ')
                    }
                  </div>
                </div>
              </div>
            </div>
          )
          : (
            <div className={containerElementStyle}>
              <div
                className={classNames(
                  'bg-white shadow-lg rounded-lg h-full',
                  'border border-dial-gray hover:border-transparent'
                )}
              >
                <div className='flex flex-col'>
                  <div className='flex text-dial-sapphire bg-dial-alice-blue rounded-t-lg h-20'>
                    <div className='px-4 text-sm text-center font-semibold m-auto'>
                      {workflow.name}
                    </div>
                  </div>
                  <div className='my-8 mx-auto'>
                    <div className='block w-16 h-16 relative opacity-60'>
                      <Image
                        layout='fill'
                        objectFit='scale-down'
                        objectPosition='left'
                        alt={format('image.alt.logoFor', { workflow: workflow.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className='text-xs text-dial-stratos font-semibold uppercase'>
                    <div className='px-6 py-2 flex gap-2'>
                      <span className='badge-avatar w-7 h-7'>
                        {useCases?.length > 0 ? useCases?.length : format('general.na')}
                      </span>
                      <span className='my-auto'>
                        {useCases?.length > 1
                          ? format('use-case.header')
                          : format('use-case.label')
                        }
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div className='text-xs text-dial-strato font-semibold uppercase'>
                    <div className='px-6 py-2 flex gap-2'>
                      <span className='badge-avatar w-7 h-7'>
                        {workflow.buildingBlocks.length > 0 ? useCases.length : format('general.na')}
                      </span>
                      <span className='my-auto'>
                        {workflow.buildingBlocks.length > 1
                          ? format('building-block.header')
                          : format('building-block.label')
                        }
                      </span>
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

export default WorkflowCard
