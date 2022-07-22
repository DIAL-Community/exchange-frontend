import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext } from '../context/BuildingBlockFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'
import { UseCaseAutocomplete } from '../filter/element/UseCase'
import { WorkflowAutocomplete } from '../filter/element/Workflow'
import Checkbox from '../shared/Checkbox'

const BuildingBlockFilter = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { setHintDisplayed } = useContext(FilterContext)

  const { showMature, sdgs, useCases, workflows } = useContext(BuildingBlockFilterContext)
  const { setShowMature, setSDGs, setUseCases, setWorkflows } = useContext(BuildingBlockFilterDispatchContext)

  const toggleWithMaturity = () => {
    setShowMature(!showMature)
  }

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-xs'>
          <a className='cursor-pointer font-semibold flex gap-1' onClick={() => setHintDisplayed(true)}>
            {format('filter.hint.text')} {format('building-block.label')}
            <BsQuestionCircleFill className='inline text-sm mb-1' />
          </a>
        </div>
        <div className='text-sm flex flex-row'>
          <div className='text-xl px-2 pb-3'>
            {format('filter.framework.title').toUpperCase()}
          </div>
        </div>
        <div className='text-sm flex flex-row'>
          <div className='pl-2 pr-4 pb-2'>
            {format('filter.framework.subTitle', { entity: format('building-block.header') })}
          </div>
        </div>
        <div className='text-sm flex flex-row flex-wrap'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <UseCaseAutocomplete {...{ useCases, setUseCases }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <WorkflowAutocomplete {...{ workflows, setWorkflows }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>
        <div className='col-span-11 lg:col-span-6'>
          <div className='text-xl px-2 pb-3 pt-2'>
            {format('filter.entity', { entity: format('buildingBlock.label') }).toUpperCase()}
          </div>
          <div className='text-sm flex flex-row'>
            <div className='px-2 pb-2'>
              <label className='inline-flex items-center'>
                <Checkbox onChange={toggleWithMaturity} value={showMature} />
                <span className='ml-2'>{format('filter.buildingBlock.matureOnly')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockFilter
