import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const WorkflowDetailHeader = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {workflow.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {workflow.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='inline'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.workflow.label') })}
              className='object-contain w-20 h-20'
            />
          </div>
        }
        {workflow.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.workflow.label') })}
              className='object-contain dial-plum-filter'
            />
          </div>
        }
      </div>
    </div>
  )
}

export default WorkflowDetailHeader
