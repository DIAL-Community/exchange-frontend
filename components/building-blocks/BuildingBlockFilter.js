import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext }
  from '../context/BuildingBlockFilterContext'
import { SDGAutocomplete } from '../filter/element/SDG'
import { UseCaseAutocomplete } from '../filter/element/UseCase'
import { WorkflowAutocomplete } from '../filter/element/Workflow'
import BuildingBlockHint from '../filter/hint/BuildingBlockHint'
import Checkbox from '../shared/Checkbox'

const BuildingBlockFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showMature, sdgs, useCases, workflows } = useContext(BuildingBlockFilterContext)
  const { setShowMature, setSDGs, setUseCases, setWorkflows } = useContext(BuildingBlockFilterDispatchContext)

  const toggleWithMaturity = () => {
    setShowMature(!showMature)
  }

  const [openingDetail, setOpeningDetail] = useState(false)
  const toggleHintDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  return (
    <div className='py-6 bg-dial-solitude rounded-lg text-dial-stratos'>
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
            <span className='mr-1'>{format('filter.hint.text')} {format('building-block.label')}</span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <BuildingBlockHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        <div className='text-xl px-6'>
          {format('filter.framework.title').toUpperCase()}
        </div>
        <div className='px-6'>
          {format('filter.framework.subTitle', { entity: format('building-block.header') })}
        </div>
        <div className='text-sm flex flex-col gap-3 px-6'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} />
          <UseCaseAutocomplete {...{ useCases, setUseCases }} />
          <WorkflowAutocomplete {...{ workflows, setWorkflows }} />
        </div>
        <div className='text-xl px-6'>
          {format('filter.entity', { entity: format('buildingBlock.label') }).toUpperCase()}
        </div>
        <div className='px-6'>
          <label className='inline-flex items-center'>
            <Checkbox onChange={toggleWithMaturity} value={showMature} />
            <span className='ml-2'>{format('filter.buildingBlock.matureOnly')}</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockFilter
