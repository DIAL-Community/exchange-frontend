import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'

const OpportunityHint = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-2 text-dial-stratos'>
      <div className='text-xl font-semibold'>
        {format('ui.opportunity.label')}
      </div>
      <div className='text-base'>
        {format('ui.opportunity.hint.subtitle')}
      </div>
      <div className='mx-auto'>
        <Image
          height={200}
          width={200}
          src='/images/tiles/opportunity.svg'
          alt='' />
      </div>
      <div className='text-lg font-semibold'>
        {format('ui.opportunity.hint.characteristicTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {format('ui.opportunity.hint.characteristics')}
      </div>
      <div className='text-lg font-semibold'>
        {format('ui.opportunity.hint.descriptionTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {parse(format('ui.opportunity.hint.description'))}
      </div>
    </div>
  )
}

export default OpportunityHint
