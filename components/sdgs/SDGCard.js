import Link from 'next/link'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('SDGs')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const SDGCard = ({ sdg, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const useCases = (() => {
    if (!sdg.sdgTargets) {
      return
    }

    const useCases = []
    sdg.sdgTargets.map(sdgTarget => {
      sdgTarget.useCases.map(useCase => {
        const workflowSlugs = useCases.map(u => u.slug)
        if (workflowSlugs.indexOf(useCase.slug) === -1) {
          useCases.push(useCase)
        }

        return useCase
      })

      return sdgTarget
    })

    return useCases
  })()

  const listDisplayType = () =>
    <div className={containerElementStyle}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
          <div className='w-10/12 lg:w-4/12 flex gap-2 my-auto text-dial-sapphire'>
            <div className='block w-6 h- relative'>
              <Image
                fill
                className='object-contain'
                src={`/assets/sdg/sdg_${('0' + sdg.number).slice(-2)}.png`}
                alt={format('image.alt.logoFor', { name: sdg.name })}
              />
            </div>
            <div className='w-full font-semibold'>
              {sdg.name}
            </div>
          </div>
          <div className='w-8/12 lg:w-7/12 line-clamp-1'>
            { useCases && useCases.length === 0 && format('general.na') }
            {
              useCases && useCases.length > 0 &&
                useCases.map(u => u.name).join(', ')
            }
          </div>
        </div>
      </div>
    </div>

  const cardDisplayType = () =>
    <div className={containerElementStyle}>
      <div
        className={classNames(
          'bg-white shadow-lg rounded-lg h-full',
          'border border-dial-gray hover:border-transparent'
        )}
      >
        <div className='flex flex-col'>
          <div className='flex text-dial-sapphire bg-dial-alice-blue rounded-t-lg h-20'>
            <div className='px-4 text-sm text-center font-semibold m-auto'>
              {sdg.name}
            </div>
          </div>
          <div className='w-24 py-8 mx-auto'>
            <Image
              height={1500}
              width={1500}
              alt={format('image.alt.logoFor', { name: sdg.name })}
              src={`/assets/sdg/sdg_${('0' + sdg.number).slice(-2)}.png`}
            />
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-6 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {sdg.sdgTargets.length}
              </span>
              <span className='my-auto'>
                {sdg.sdgTargets.length > 1 ? format('ui.sdgTarget.header') : format('ui.sdgTarget.label')}
              </span>
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-6 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {useCases.length > 0 ? useCases.length : format('general.na')}
              </span>
              <span className='my-auto'>
                {useCases.length > 1 ? format('ui.useCase.header') : format('ui.useCase.label')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <Link href={`/${collectionPath}/${sdg.slug}`}>
      { listType === 'list' ? listDisplayType() : cardDisplayType() }
    </Link>
  )
}

export default SDGCard
