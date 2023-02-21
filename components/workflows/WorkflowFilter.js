import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { WorkflowFilterContext, WorkflowFilterDispatchContext } from '../context/WorkflowFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'
import { UseCaseAutocomplete } from '../filter/element/UseCase'
import WorkflowHint from '../filter/hint/WorkflowHint'

const WorkflowFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sdgs, useCases } = useContext(WorkflowFilterContext)
  const { setSDGs, setUseCases } = useContext(WorkflowFilterDispatchContext)

  const [openingDetail, setOpeningDetail] = useState(false)

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
            <span className='py-1 border-b-2 border-transparent hover:border-dial-yellow'>
              {format('filter.hint.text')} {format('workflow.label')}
            </span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <WorkflowHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        <div className='text-xl px-6'>
          {format('filter.framework.title').toUpperCase()}
        </div>
        <div className='px-6'>
          {format('filter.framework.subTitle', { entity: format('workflow.header') })}
        </div>
        <div className='px-6 flex flex-col gap-3'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} />
          <UseCaseAutocomplete {...{ useCases, setUseCases }} />
        </div>
      </div>
    </div>
  )
}

export default WorkflowFilter
