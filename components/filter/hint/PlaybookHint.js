import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'

const PlaybookHint = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-2 text-dial-stratos'>
      <div className='text-xl font-semibold'>
        {format('playbooks.label')}
      </div>
      <div className='text-base'>
        {format('playbook.hint.subtitle')}
      </div>
      <div className='mx-auto'>
        <Image
          height={200}
          width={200}
          src='/images/tiles/use-case.svg'
          alt='' />
      </div>
      <div className='text-lg font-semibold'>
        {format('playbook.hint.characteristicTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {parse(format('playbook.hint.characteristics'))}
      </div>
      <div className='text-lg font-semibold'>
        {format('playbook.hint.descriptionTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {format('playbook.hint.description')}
      </div>
    </div>
  )
}

export default PlaybookHint
