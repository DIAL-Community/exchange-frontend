import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'

const UseCaseCard = ({ displayType, index, useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-cotton'}`}>
      <div className='flex flex-row gap-x-6'>
        <img
          // src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
          src='/ui/v1/use-case-header.svg'
          alt={format('ui.image.logoAlt', { name: 'Use Cases' })}
          width={70}
          height={70}
          // className='object-contain dial-blueberry-filter'
          className='object-contain'
        />
        <div className='flex flex-col gap-y-3'>
          <div className='text-lg font-semibold text-dial-blueberry'>
            {useCase.name}
          </div>
          {/*
          <HtmlViewer
            initialContent={useCase?.useCaseDescription?.description}
            editorId={`${index}-use-case-detail`}
            className='-mb-12'
          />
          */}
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdgTarget.header')} ({useCase.sdgTargets?.length ?? 0})
            </div>
            <div className='border border-r border-dial-slate-300' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({useCase.buildingBlocks?.length ?? 0})
            </div>
          </div>
          <div className='flex text-[10px] text-white'>
            <div className='px-6 py-1 rounded-lg bg-dial-slate-500'>
              {useCase.maturity}
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    displayType === DisplayType.LARGE_CARD && displayLargeCard()
  )
}

export default UseCaseCard
