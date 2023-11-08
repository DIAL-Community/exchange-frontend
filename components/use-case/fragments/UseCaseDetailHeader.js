import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../utils/utilities'

const UseCaseDetailHeader = ({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-blueberry font-semibold'>
        {useCase.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {useCase.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 px-1 py-1 rounded-full bg-dial-blueberry'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
              className='object-contain dial-blueberry-filter w-14 h-14 mx-auto my-2 white-filter'
            />
          </div>
        }
        {useCase.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
              className='object-contain dial-blueberry-filter'
            />
          </div>
        }
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        {useCase.govStackEntity &&
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-dial-sapphire'>
              {format('ui.useCase.source')}
            </div>
            <div className='flex text-dial-stratos'>
              {format('govstack.label')}
            </div>
          </div>
        }
        {useCase.markdownUrl &&
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-dial-blueberry'>
              {format('useCase.markdownUrl')}
            </div>
            <div className='flex text-dial-stratos'>
              <a
                href={prependUrlWithProtocol(useCase.markdownUrl)}
                target='_blank'
                rel='noreferrer'
                className='flex border-b border-dial-iris-blue '>
                <div className='line-clamp-1 break-all'>
                  {useCase.markdownUrl}
                </div>
              </a>
              &nbsp;⧉
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default UseCaseDetailHeader
