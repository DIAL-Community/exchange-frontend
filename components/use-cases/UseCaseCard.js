import Link from 'next/link'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Use Cases')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const UseCaseCard = ({ useCase, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const workflows = (() => {
    if (!useCase.useCaseSteps) {
      return
    }

    const workflows = []
    useCase.useCaseSteps.map(useCaseStep => {
      useCaseStep.workflows.map(workflow => {
        const workflowSlugs = workflows.map(u => u.slug)
        if (workflowSlugs.indexOf(workflow.slug) === -1) {
          workflows.push(workflow)
        }

        return workflow
      })

      return useCaseStep
    })

    return workflows
  })()

  const listDisplayType = () =>
    <div className={containerElementStyle}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
          <div className='w-10/12 lg:w-4/12 flex gap-2 my-auto text-dial-sapphire'>
            <div className='block w-6 h-6 relative opacity-60'>
              <Image
                fill
                className='object-contain'
                alt={format('image.alt.logoFor', { name: useCase.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              />
            </div>
            <div className='w-full font-semibold'>
              {useCase.name}
            </div>
          </div>
          {
            useCase.sdgTargets &&
            <div className='w-8/12 lg:w-2/12 line-clamp-1'>
              {useCase.sdgTargets.length === 0 && format('general.na')}
              {useCase.sdgTargets.length > 0 &&
                useCase.sdgTargets.map(u => u.targetNumber).join(', ')
              }
            </div>
          }
          {
            workflows &&
            <div className='w-8/12 lg:w-4/12 line-clamp-1'>
              {workflows.length === 0 && format('general.na')}
              {workflows.length > 0 &&
                workflows.map(b => b.name).join(', ')
              }
            </div>
          }
          <div className='ml-auto font-semibold my-auto'>
            <div className='text-dial-gray-dark text-xs font-semibold'>
              {useCase.maturity.toUpperCase()}
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
          <div className='relative'>
            <div className='absolute right-2 top-2'>
              <div className='text-dial-gray-dark text-xs font-semibold'>
                {useCase.maturity.toUpperCase()}
              </div>
            </div>
          </div>
          <div className='flex text-dial-sapphire bg-dial-alice-blue h-24 rounded-t-lg'>
            <div className='px-4 text-sm text-center font-semibold m-auto'>
              {useCase.name}
            </div>
          </div>
          <div className='my-8 mx-auto'>
            <div className='block w-24 h-16 relative opacity-60'>
              <Image
                fill
                className='object-contain'
                alt={format('image.alt.logoFor', { name: useCase.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              />
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {workflows.length}
              </span>
              <span className='my-auto'>
                {workflows.length > 1 ? format('workflow.header') : format('workflow.label')}
              </span>
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {useCase.sdgTargets.length}
              </span>
              <span className='my-auto'>
                {useCase.sdgTargets.length > 1 ? format('sdg-target.header') : format('sdg-target.label')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    !newTab
      ? <Link href={`/${collectionPath}/${useCase.slug}`}>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </Link>
      : <a href={`/${collectionPath}/${useCase.slug}`} target='_blank' rel='noreferrer' role='menuitem'>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </a>
  )
}

export default UseCaseCard
