import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import classNames from 'classnames'
import parse from 'html-react-parser'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const WorkflowCard = ({ displayType, index, workflow }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-cotton'}`}>
      <div className='flex flex-row gap-x-6'>
        <img
          // src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
          src='/ui/v1/use-case-header.svg'
          alt={format('ui.image.logoAlt', { name:  format('ui.workflow.header') })}
          width={70}
          height={70}
          className='object-contain'
        />
        <div className='flex flex-col gap-y-3'>
          <div className='text-lg font-semibold text-dial-plum'>
            {workflow.name}
          </div>
          <div className='line-clamp-4 max-w-3xl'>
            {workflow.workflowDescription && parse(workflow?.workflowDescription?.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdgTarget.header')} ({workflow.sdgTargets?.length ?? 0})
            </div>
            <div className='border border-r border-dial-slate-300' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({workflow.buildingBlocks?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg'>
      <div className='flex flex-row gap-x-3 px-4 py-3'>
        <div className='rounded-full bg-dial-plum w-10 h-10 min-w-[2.5rem]'>
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
            // src='/ui/v1/workflow-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.workflow.header') })}
            className={classNames(
              'object-contain w-6 h-6 my-2 mx-auto',
              workflow.imageFile.indexOf('placeholder.svg') <= 0 ? 'w-6 h-6 my-2 white-filter' : '',
            )}
          />
        </div>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {workflow.name}
        </div>
      </div>
    </div>

  return (
    <Link href={`${REBRAND_BASE_PATH}/workflows/${workflow.slug}`}>
      {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
    </Link>
  )
}

export default WorkflowCard
