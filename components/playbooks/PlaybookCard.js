import Link from 'next/link'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import ReactHtmlParser from 'react-html-parser'

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

  return (
    <Link href={`/${collectionPath}/${playbook.slug}`}>
      {
        listType === 'list'
          ? (
            <div className='group border-3 border-transparent hover:border-dial-yellow cursor-pointer'>
              <div className='bg-white border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='flex flex-col md:flex-row flex-wrap my-5 px-4 gap-2'>
                  <div className={` ${ellipsisTextStyle} pr-3 text-base font-semibold group-hover:text-dial-yellow`}>
                    <img
                      data-tip={format('tooltip.forEntity', { entity: format('playbooks.label'), name: playbook.name })}
                      alt={format('image.alt.logoFor', { name: playbook.name })} className='m-auto h-6 workflow-filter inline mr-3'
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
                    />
                    {playbook.name}
                  </div>
                  <div className={`${filterDisplayed ? 'flex gap-1.5 text-sm lg:ml-auto' : 'md:ml-auto'}`}>
                    {
                      playbook.tags.map((tag, index) => {
                        return (<div key={index} className='bg-dial-gray-light px-2 py-1.5 rounded'>{tag}</div>)
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='group border-3 border-transparent hover:border-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent drop-shadow'>
                <div className='flex flex-col h-80 p-4 group-hover:text-dial-yellow'>
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
                <div className='bg-dial-gray-light'>
                  <div className='px-3 py-3 text-sm'>
                    <div className='max-h-16 playbook-description overflow-hidden'>
                      {playbook.playbookDescription && ReactHtmlParser(playbook.playbookDescription.overview)}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light px-3 py-3 text-sm gap-1'>
                  <div className='font-semibold'>{format('tag.header')}</div>
                  <div className='flex flex-row gap-1'>
                    {
                      playbook.tags.map((tag, index) => {
                        return (<div key={index} className='bg-white px-2 py-1.5 rounded'>{tag}</div>)
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            )
      }
    </Link>
  )
}

export default PlaybookCard
