import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../context/UseCaseFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'
import UseCaseHint from '../filter/hint/UseCaseHint'
import Checkbox from '../shared/Checkbox'

const UseCaseFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [openingDetail, setOpeningDetail] = useState(false)

  const { sdgs, showBeta, govStackOnly } = useContext(UseCaseFilterContext)
  const { setSDGs, setShowBeta, setShowGovStack } = useContext(UseCaseFilterDispatchContext)

  const toggleShowBeta = () => {
    setShowBeta(!showBeta)
  }

  const toggleShowGovStack = () => {
    setShowGovStack(!govStackOnly)
  }

  const toggleHintDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  return (
    <div className='pt-6 pb-10 bg-dial-solitude rounded-lg text-dial-stratos'>
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
            <span className='py-1 border-b-2 border-transparent hover:border-dial-sunshine'>
              {format('filter.hint.text')} {format('useCase.label')}
            </span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <UseCaseHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        <div className='px-6 text-xl'>
          {format('filter.framework.title').toUpperCase()}
        </div>
        <div className='px-6 text-sm'>
          {format('filter.framework.subTitle', { entity: format('useCase.header') })}
        </div>
        <div className='text-sm flex flex-col gap-3 px-6'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} />
        </div>
        <div className='text-xl px-6'>
          {format('filter.entity', { entity: format('useCase.label') }).toUpperCase()}
        </div>
        <div className='px-6'>
          <label className='inline'>
            <Checkbox onChange={toggleShowBeta} value={showBeta} />
            <span className='mx-2 my-auto text-sm'>
              {format('filter.useCase.showDraft')}
            </span>
          </label>
        </div>
        <div className='px-6'>
          <label className='inline'>
            <Checkbox onChange={toggleShowGovStack} value={govStackOnly} />
            <span className='mx-2 my-auto text-sm'>
              {format('filter.useCase.govStackOnly')}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default UseCaseFilter
