import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'

import { FilterContext } from '../context/FilterContext'
import { SDGFilterContext, SDGFilterDispatchContext } from '../context/SDGFilterContext'

import { SDGAutocomplete } from '../filter/element/SDG'

const SDGFilter = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { setOpenHint } = useContext(FilterContext)

  const { sdgs } = useContext(SDGFilterContext)
  const { setSDGs } = useContext(SDGFilterDispatchContext)

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-xs'>
          <button href='openHint' className='font-semibold flex gap-1' onClick={() => setOpenHint(true)}>
            {format('filter.hint.text.an')} {format('sdg.shortLabel')}
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
            {format('filter.framework.subTitle', { entity: format('sdg.header') })}
          </div>
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-row flex-wrap'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>
      </div>
    </div>
  )
}

export default SDGFilter