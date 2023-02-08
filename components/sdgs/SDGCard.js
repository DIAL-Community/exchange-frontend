import Link from 'next/link'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('SDGs')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-yellow'
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

  const nameColSpan = () => {
    return !useCases
      ? 'col-span-6'
      : 'col-span-5 md:col-span-3 lg:col-span-2'
  }

  const caseColSpan = () => {
    return !useCases
      ? 'hidden'
      : 'hidden lg:block lg:col-span-3 lg:col-span-4'
  }

  return (
    <Link href={`/${collectionPath}/${sdg.slug}`}>
      {
        listType === 'list'
          ? (
            <div className={containerElementStyle}>
              <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                <div className='grid grid-cols-1 lg:grid-cols-6 gap-x-4 py-4 px-4'>
                  <div className={`${nameColSpan()} text-base text-sdg font-semibold relative`}>
                    <Image
                      layout='fill'
                      objectFit='scale-down'
                      objectPosition='left'
                      sizes='2vw'
                      src={`/assets/sdg/sdg_${('0' + sdg.number).slice(-2)}.png`}
                      alt={format('image.alt.logoFor', { name: sdg.name })}
                    />
                    <div className='ml-10'>
                      {sdg.name}
                    </div>
                    {
                      useCases &&
                        <div
                          className={`
                            block lg:hidden
                            text-use-case text-sm font-normal flex flex-row mt-1
                          `}
                        >
                          <div className='inline'>
                            {format('useCase.header')}:
                          </div>
                          <div className='mx-1 whitespace-nowrap text-ellipsis overflow-hidden'>
                            {
                              useCases.length === 0 && format('general.na')
                            }
                            {
                              useCases.length > 0 &&
                                useCases.map(u => u.name).join(', ')
                            }
                          </div>
                        </div>
                    }
                  </div>
                  <div className={`${caseColSpan()} text-base text-use-case`}>
                    { useCases && useCases.length === 0 && format('general.na') }
                    {
                      useCases && useCases.length > 0 &&
                        useCases.map(u => u.name).join(', ')
                    }
                  </div>
                </div>
              </div>
            </div>
          )
          : (
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
                    <div className='px-6 py-2 flex gap-1'>
                      <span className='badge-avatar w-7 h-7'>
                        {sdg.sdgTargets.length}
                      </span>
                      <span className='my-auto'>
                        {format('sdg-target.header')}
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div className='text-xs text-dial-stratos uppercase'>
                    <div className='px-6 py-2 flex gap-1'>
                      <span className='badge-avatar w-7 h-7'>
                        {useCases.length > 0 ? useCases.length : format('general.na')}
                      </span>
                      <span className='my-auto'>
                        {useCases.length > 1 ? format('use-case.header') : format('use-case.label')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
      }
    </Link>
  )
}

export default SDGCard
