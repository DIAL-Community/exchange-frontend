import classNames from 'classnames'
import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
import { SDGFilterContext, SDGFilterDispatchContext } from '../context/SDGFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'

const SDGFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { setHintDisplayed } = useContext(FilterContext)

  const { sdgs } = useContext(SDGFilterContext)
  const { setSDGs } = useContext(SDGFilterDispatchContext)

  return (
    <div className='px-4 py-4 bg-dial-solitude rounded-lg'>
      <div className='text-dial-stratos flex flex-col gap-3'>
        <div className='px-2 mb-4 text-base'>
          <a
            className={classNames(
              'cursor-pointer font-semibold hover:underline',
              'decoration-2 decoration-dial-yellow'
            )}
            onClick={() => setHintDisplayed(true)}
          >
            <span className='mr-1'>{format('filter.hint.text.an')} {format('sdg.shortLabel')}</span>
            <BsQuestionCircleFill className='inline text-xl fill-dial-yellow' />
          </a>
        </div>
        <div className='flex flex-row'>
          <div className='px-2'>
            {format('app.filter')}
          </div>
        </div>
        <div className='text-dial-gray-dark flex flex-row flex-wrap'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>
      </div>
    </div>
  )
}

export default SDGFilter
