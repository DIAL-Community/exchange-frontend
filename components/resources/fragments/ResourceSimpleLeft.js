import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const ResourceSimpleLeft = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <div className='text-xl font-semibold text-dial-stratos'>
          {format('ui.resource.label')}
        </div>
      </div>
    </div>
  )
}

export default ResourceSimpleLeft
