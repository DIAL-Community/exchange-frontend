import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useCallback, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import Image from 'next/image'
import { ORIGIN_ACRONYMS, ORIGIN_EXPANSIONS } from '../../lib/utilities'

const ellipsisTextStyle = `
  whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-dataset hover:text-dial-yellow
`

const DatasetCard = ({ dataset, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <Link href={`/datasets/${dataset.slug}`}>
      <a {... newTab && { target: '_blank' }}>
        {
          listType === 'list'
            ? (
              <div className={`${containerElementStyle}`}>
                <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='flex flex-row flex-wrap lg:gap-x-4 px-4' style={{ minHeight: '4.5rem' }}>
                    <div className='w-10/12 lg:w-4/12 text-base font-semibold text-dial-gray-dark my-auto relative'>
                      <Image
                        layout='fill'
                        objectFit='scale-down'
                        objectPosition='left'
                        sizes='1vw'
                        alt={format('image.alt.logoFor', { name: dataset.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
                      />
                      <div className={`ml-8 w-4/5 h-3/5 font-semibold relative ${ellipsisTextStyle}`}>
                        {dataset.name}
                      </div>
                    </div>
                    <div className={`w-8/12 lg:w-4/12 text-sm lg:text-base text-dial-purple ${ellipsisTextStyle}`}>
                      {dataset.origins && dataset.origins.length === 0 && format('general.na')}
                      {
                        dataset.origins && dataset.origins.length > 0 &&
                        dataset.origins
                          .map(origin => ORIGIN_EXPANSIONS[origin.name.toLowerCase()] || origin.name)
                          .join(', ')
                      }
                    </div>
                    <div className='w-4/12 lg:w-2/12 text-right text-sm lg:text-base font-semibold text-dial-cyan my-auto'>
                      {dataset.datasetType === 'dataset' ? format('dataset.card.dataset').toUpperCase() : ''}
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
              <div className={containerElementStyle}>
                <div className='h-full flex flex-col border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='flex flex-row gap-x-1.5 p-1.5 border-b border-dial-gray dataset-card-header'>
                    {
                      dataset.tags.indexOf(format('dataset.card.coronavirusTagValue').toLowerCase()) >= 0 &&
                        <img
                          alt={format('image.alt.logoFor', { name: format('coronavirus.title') })}
                          data-tip={format('tooltip.covid')} className='h-5' src='/icons/coronavirus/coronavirus.png'
                        />
                    }
                    {
                      <div className='ml-auto text-dial-cyan text-sm font-semibold'>
                        {dataset.datasetType.toUpperCase()}
                      </div>
                    }
                  </div>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-64 2xl:w-80'>
                      {dataset.name}
                    </div>
                    {
                      dataset.datasetDescription &&
                        <img
                          className='ml-auto opacity-20 hover:opacity-100 dataset-filter'
                          data-tip={dataset.datasetDescription.description}
                          data-html
                          alt='Info' height='20px' width='20px' src='/icons/info.svg'
                        />
                    }
                    <div className='m-auto w-3/5 h-3/5 relative' >
                      <Image
                        layout='fill'
                        objectFit='contain'
                        alt={format('image.alt.logoFor', { name: dataset.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='pb-3 flex flex-row flex-wrap justify-between border-b border-dial-gray'>
                      <div className='pl-3 pt-3 flex flex-row'>
                        <div className='text-base my-auto mr-1'>{format('dataset.card.sdgs')}</div>
                        <div className='bg-white rounded p-1.5 flex flex-row gap-x-1'>
                          {
                            dataset.sustainableDevelopmentGoals.length === 0 &&
                              <span className='text-base my-1 mx-auto font-semibold'>
                                {format('general.na')}
                              </span>
                          }
                          {
                            dataset.sustainableDevelopmentGoals
                              .filter((_, index) => index <= 1)
                              .map(sdg => (
                                <img
                                  data-tip={format('tooltip.forEntity', { entity: format('sdg.label'), name: sdg.name })}
                                  key={`sdg-${sdg.slug}`} className='h-8 cursor-default'
                                  alt={format('image.alt.logoFor', { name: sdg.name })}
                                  src={`/images/sdgs/${sdg.slug}.png`}
                                />
                              ))
                          }
                          {
                            dataset.sustainableDevelopmentGoals.length > 2 &&
                              <span className='text-base'>...</span>
                          }
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-row justify-between text-dial-gray-dark'>
                      <div className='pl-3 py-3 flex-auto flex flex-col'>
                        <div className='text-base my-auto'>{format('product.card.license')}</div>
                        <div className='bg-white mt-1.5 mr-auto p-2 rounded text-sm font-semibold'>
                          {(dataset.license || format('general.na')).toUpperCase()}
                        </div>
                      </div>
                      <div className='pr-3 py-3 flex-auto flex flex-col'>
                        <div className='text-base text-right my-auto'>Sources</div>
                        <div className='flex flex-row justify-end font-semibold'>
                          {
                            dataset.origins.length === 0 &&
                              <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'>
                                {format('general.na')}
                              </div>
                          }
                          {
                            dataset.origins
                              .filter((_, index) => index <= 2)
                              .map(origin => {
                                return (
                                  <div
                                    key={`origin-${origin.slug}`} className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'
                                  >
                                    {(ORIGIN_ACRONYMS[origin.slug.toLowerCase()] || origin.slug).toUpperCase()}
                                  </div>
                                )
                              })
                          }
                          {
                            dataset.origins.length > 3 &&
                              <div
                                className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'
                                data-tip={format('tooltip.ellipsisFor', { entity: format('dataset.label') })}
                              >
                                &hellip;
                              </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        }
      </a>
    </Link>
  )
}

export default DatasetCard
