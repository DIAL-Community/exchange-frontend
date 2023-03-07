import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
import { WorkflowFilterContext, WorkflowFilterDispatchContext } from '../context/WorkflowFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'
import { UseCaseAutocomplete } from '../filter/element/UseCase'

const WorkflowFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { setHintDisplayed } = useContext(FilterContext)

  const { sdgs, useCases } = useContext(WorkflowFilterContext)
  const { setSDGs, setUseCases } = useContext(WorkflowFilterDispatchContext)

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-base'>
          <a
            className={`
              cursor-pointer font-semibold gap-1 hover:underline
              decoration-2 decoration-dial-yellow
            `}
            onClick={() => setHintDisplayed(true)}
          >
            <span className='mr-1'>
              {format('filter.hint.text')} {format('workflow.label')}
            </span>
            <BsQuestionCircleFill className='inline text-xl mb-1 fill-dial-yellow' />
          </a>
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-row'>
          <div className='text-xl px-2 pb-3'>
            {format('filter.framework.title').toUpperCase()}
          </div>
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-row'>
          <div className='pl-2 pr-4 pb-2'>
            {format('filter.framework.subTitle', { entity: format('workflow.header') })}
          </div>
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-row flex-wrap'>
          <SDGAutocomplete
            {...{ sdgs, setSDGs }}
            containerStyles='px-2 pb-2'
            controlSize='20rem'
          />
          <UseCaseAutocomplete
            {...{ useCases, setUseCases }}
            containerStyles='px-2 pb-2'
            controlSize='20rem'
          />
        </div>
      </div>
    </div>
  )
}

export default WorkflowFilter
