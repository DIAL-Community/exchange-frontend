import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'

import { FilterContext } from '../context/FilterContext'
import { WorkflowFilterContext, WorkflowFilterDispatchContext } from '../context/WorkflowFilterContext'

import { SDGAutocomplete } from '../filter/element/SDG'
import { UseCaseAutocomplete } from '../filter/element/UseCase'

const WorkflowFilter = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { setHintDisplayed } = useContext(FilterContext)

  const { sdgs, useCases } = useContext(WorkflowFilterContext)
  const { setSDGs, setUseCases } = useContext(WorkflowFilterDispatchContext)

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-xs'>
          <button className='font-semibold flex gap-1' onClick={() => setHintDisplayed(true)}>
            {format('filter.hint.text')} {format('workflow.label')}
            <BsQuestionCircleFill className='inline text-sm mb-1' />
          </button>
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
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <UseCaseAutocomplete {...{ useCases, setUseCases }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>
      </div>
    </div>
  )
}

export default WorkflowFilter
