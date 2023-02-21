import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'

const ProductHint = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-2 text-dial-stratos'>
      <div className='text-xl font-semibold'>
        {format('product.label')}
      </div>
      <div className='text-base'>
        {format('product.hint.subtitle')}
      </div>
      <div className='mx-auto'>
        <Image
          height={200}
          width={200}
          src='/images/tiles/product.svg'
          alt='Product hint logo.' />
      </div>
      <div className='text-lg font-semibold'>
        {format('product.hint.characteristicTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {format('product.hint.characteristics')}
      </div>
      <div className='text-lg font-semibold'>
        {format('product.hint.descriptionTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {parse(format('product.hint.description'))}
      </div>
    </div>
  )
}

export default ProductHint
