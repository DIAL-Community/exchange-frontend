import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { SDGFilterContext, SDGFilterDispatchContext } from '../context/SDGFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'
import SDGHint from '../filter/hint/SDGHint'

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
    <div className='py-6 bg-dial-solitude rounded-lg'>
      <div className='text-dial-stratos flex flex-col gap-3'>
        <div className='px-6 text-base flex'>
          <a
            className='cursor-pointer font-semibold flex gap-2'
            onClick={() => toggleHintDetail()}
          >
            <div className='w-6 my-auto image-block-hack'>
              <Image
                width={34}
                height={34}
                src='/assets/info.png'
                alt='Informational hint'
              />
            </div>
            <span className='py-1 border-b-2 border-transparent hover:border-dial-yellow'>
              {format('filter.hint.text.an')} {format('sdg.shortLabel')}
            </span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <SDGHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        <div className='px-6'>
          {format('app.filter')}
        </div>
        <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-6 pb-2 w-full' />
      </div>
    </div>
  )
}

export default SDGFilter
