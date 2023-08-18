import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../utils/utilities'

const DatasetDetailHeader = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {dataset.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {dataset.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='inline'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.dataset.label') })}
              className='object-contain w-20 h-20'
            />
          </div>
        }
        {dataset.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20 rounded-full bg-dial-plum'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.dataset.label') })}
              className='object-contain w-12 h-12 mx-auto white-filter mt-3'
            />
          </div>
        }
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('dataset.website')}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <a
              href={prependUrlWithProtocol(dataset.website)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1'>
                {dataset.website}
              </div>
            </a>
            ⧉
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.sector.header')}
          </div>
          <div className='flex flex-col gap-y-2 text-dial-stratos'>
            {dataset.sectors.length === 0 && format('general.na')}
            {dataset.sectors.map((sector, index) => {
              return <div key={index}>{sector.name}</div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetDetailHeader
