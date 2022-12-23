import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../context/UseCaseFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'
import Checkbox from '../shared/Checkbox'

const UseCaseFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { setHintDisplayed } = useContext(FilterContext)

  const { sdgs, showBeta } = useContext(UseCaseFilterContext)
  const { setSDGs, setShowBeta } = useContext(UseCaseFilterDispatchContext)

  const toggleShowBeta = () => {
    setShowBeta(!showBeta)
  }

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-base'>
          <a
            className='cursor-pointer items-center font-semibold gap-1 hover:underline decoration-2 decoration-dial-yellow'
            onClick={() => setHintDisplayed(true)}
          >
            <span className='mr-1'>{format('filter.hint.text')} {format('useCase.label')}</span>
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
                <Checkbox onChange={toggleShowBeta} value={showBeta} />
                <span className='ml-2'>{format('filter.useCase.showDraft')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseCaseFilter
