import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { prependUrlWithProtocol } from '../../utils/utilities'
import DatasetDetailSectors from './DatasetDetailSectors'

const DatasetDetailHeader = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

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
            {format('ui.dataset.website')}
          </div>
          <div className='flex text-dial-stratos'>
            <a
              href={prependUrlWithProtocol(dataset.website)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1 break-all'>
                {dataset.website}
              </div>
            </a>
            &nbsp;⧉
          </div>
        </div>
        <DatasetDetailSectors dataset={dataset} canEdit={canEdit} />
      </div>
    </div>
  )
}

export default DatasetDetailHeader
