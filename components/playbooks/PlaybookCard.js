import Link from 'next/link'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'

import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Playbooks')

const ellipsisTextStyle = `
   whitespace-nowrap overflow-ellipsis overflow-hidden my-auto
`

const PlaybookCard = ({ playbook, listType, filterDisplayed }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const nameColSpan = (organization) => {
    return !organization.sectors
      ? 'col-span-8'
      : filterDisplayed ? 'col-span-8 md:col-span-6 xl:col-span-3' : 'col-span-8 md:col-span-7 lg:col-span-3'
  }

  return (
    <Link href={`/${collectionPath}/${playbook.slug}`}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-workflow hover:text-dial-yellow cursor-pointer'>
              <div className='bg-white border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-5 px-4'>
                  <div className={`${nameColSpan()} ${ellipsisTextStyle} pr-3 text-base font-semibold`}>
                    <img
                      data-tip={format('tooltip.forEntity', { entity: format('playbook.label'), name: playbook.name })}
                      alt={format('image.alt.logoFor', { name: playbook.name })} className='m-auto h-6 workflow-filter inline mr-3'
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
                    />
                    {playbook.name}
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='border-3 border-transparent hover:border-dial-yellow text-building-block hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-lg hover:shadow-2xl'>
                <div className='flex flex-col h-80 p-4'>
                  <div className='text-2xl font-semibold absolute w-64 2xl:w-80 bg-white bg-opacity-70'>
                    {playbook.name}
                  </div>
                  <div className='m-auto align-middle w-40'>
                    <img
                      alt={format('image.alt.logoFor', { name: playbook.name })} className='workflow-filter'
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
                    />
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark '>
                  <div className='flex flex-row border-b border-dial-gray' />
                </div>
              </div>
            </div>
            )
      }
    </Link>
  )
}

export default PlaybookCard
