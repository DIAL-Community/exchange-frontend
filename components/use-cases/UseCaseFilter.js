import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'

import { FilterContext } from '../context/FilterContext'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../context/UseCaseFilterContext'

import { SDGAutocomplete } from '../filter/element/SDG'

const UseCaseFilter = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { setHintDisplayed } = useContext(FilterContext)

  const { sdgs, showBeta } = useContext(UseCaseFilterContext)
  const { setSDGs, setShowBeta } = useContext(UseCaseFilterDispatchContext)

  const toggleShowBeta = () => {
    setShowBeta(!showBeta)
  }

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-xs'>
          <button className='font-semibold flex gap-1' onClick={() => setHintDisplayed(true)}>
            {format('filter.hint.text')} {format('useCase.label')}
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
            {format('filter.framework.subTitle', { entity: format('useCase.header') })}
          </div>
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-row flex-wrap'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>

        <div className='col-span-11 lg:col-span-5'>
          <div className='text-dial-gray-dark text-xl px-2 pb-3 pt-2'>
            {format('filter.entity', { entity: format('useCase.label') }).toUpperCase()}
          </div>
          <div className='text-sm text-dial-gray-dark flex flex-row'>
            <div className='px-2 pb-2'>
              <label className='inline-flex items-center'>
                <input
                  type='checkbox' className='h-4 w-4 form-checkbox text-dial-gray-dark' name='show-beta'
                  checked={showBeta} onChange={toggleShowBeta}
                />
                <span className='ml-2'>{format('filter.useCase.showBeta')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseCaseFilter
