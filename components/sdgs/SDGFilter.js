import classNames from 'classnames'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { SDGFilterContext, SDGFilterDispatchContext } from '../context/SDGFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'

const SDGFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sdgs } = useContext(SDGFilterContext)
  const { setSDGs } = useContext(SDGFilterDispatchContext)

  const [openingDetail, setOpeningDetail] = useState(false)

  const toggleHintDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  return (
    <div className='px-4 py-4 bg-dial-solitude rounded-lg'>
      <div className='text-dial-stratos flex flex-col gap-3'>
        <div className='px-2 mb-4 text-base'>
          <a
            className={classNames(
              'cursor-pointer font-semibold hover:underline',
              'decoration-2 decoration-dial-yellow'
            )}
            onClick={() => toggleHintDetail()}
          >
            <span className='mr-1'>{format('filter.hint.text.an')} {format('sdg.shortLabel')}</span>
            <BsQuestionCircleFill className='inline text-xl fill-dial-yellow' />
          </a>
        </div>
        <div className={`hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          The SDGs (Sustainable Development Goals) comprise 17 goals and 169
          targets representing global priorities for investment in order to
          achieve sustainable development. The SDGs were set in 2015 by the
          United Nations General Assembly and are intended to be achieved by
          the year 2030.
        </div>
        <div className='flex flex-row'>
          <div className='px-2'>
            {format('app.filter')}
          </div>
        </div>
        <div className='text-dial-gray-dark flex flex-row flex-wrap'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2 w-full' />
        </div>
      </div>
    </div>
  )
}

export default SDGFilter
