import Link from 'next/link'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import parse from 'html-react-parser'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
import HorizontalItemList from '../shared/HorizontalItemList'
const collectionPath = convertToKey('Playbooks')

const ellipsisTextStyle = `
   whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
`

const PlaybookCard = ({ playbook, listType, filterDisplayed, newTab = false, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const isPlaybookPublished = !playbook.draft

  useEffect(() => ReactTooltip.rebuild(), [])

  return (
    <Link href={`/${collectionPath}/${playbook.slug}`}>
      <a {... newTab && { target: '_blank' }}>
        {listType === 'list' ? (
          <div className={`group ${containerElementStyle}`}>
            <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
              <div className='flex flex-col md:flex-row flex-wrap my-5 px-4 gap-2'>
                <div
                  className={` ${ellipsisTextStyle} pr-3 text-base font-semibold group-hover:text-dial-yellow`}
                >
                  <div className='m-auto w-3/5 h-3/5 relative' >
                    <Image
                      layout='fill'
                      objectFit='scale-down'
                      objectPosition='left'
                      sizes='1vw'
                      data-tip={format('tooltip.forEntity', { entity: format('playbooks.label'), name: playbook.name })}
                      alt={format('image.alt.logoFor', { name: playbook.name })}
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
                    />
                  </div>
                  {playbook.name}
                </div>
                <div className={`${filterDisplayed ? 'flex gap-1.5 text-sm lg:ml-auto' : 'md:ml-auto'}`}>
                  {playbook.tags?.map((tag, index) => {
                    return (<div key={index} className='bg-dial-gray-light px-2 py-1.5 rounded'>{tag}</div>)
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`group ${containerElementStyle} h-full`}>
            <div className='border border-dial-gray hover:border-transparent card-drop-shadow h-full'>
              <div className='flex flex-col h-full'>
                {canEdit &&
                <div
                  className={`
                    flex flex-row gap-x-1.5 p-1.5 border-b border-dial-gray
                    playbook-card-header font-semibold text-dial-cyan
                  `}
                >
                  <div>
                    {format('app.status')}
                    {format(isPlaybookPublished ? 'playbook.status.published' : 'playbook.status.draft')}
                  </div>
                </div>
                }
                <div className='flex flex-col p-4 group-hover:text-dial-yellow'>
                  <div className='text-2xl font-semibold absolute w-64 2xl:w-80'>
                    {playbook.name}
                  </div>
                  <div className='mx-auto mt-5 pt-20 w-40 h-60 relative'>
                    <Image
                      layout='fill'
                      objectFit='contain'
                      alt={format('image.alt.logoFor', { name: playbook.name })}
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
                      data-testid={`playbook-card-image-${playbook.id}`}
                    />
                  </div>
                </div>
                <div className='bg-dial-gray-light flex flex-col h-full'>
                  <div className='px-3 py-3 text-sm'>
                    <div className='line-clamp-3'>
                      {playbook.playbookDescription && parse(playbook.playbookDescription.overview)}
                    </div>
                  </div>
                  {playbook?.tags.length > 0 && (
                    <div className='flex flex-col bg-dial-gray-light px-3 pb-3 text-sm gap-1'>
                      <div className='font-semibold'>{format('tag.header')}</div>
                      <HorizontalItemList
                        restTooltipMessage={
                          format('tooltip.ellipsisFor', { entity: format('playbooks.label') })
                        }
                      >
                        {playbook.tags.map((tag, tagIdx) => (
                          <div
                            key={`playbook-${tagIdx}`}
                            className='bg-white px-2 py-1.5 rounded'
                          >
                            {tag}
                          </div>
                        ))}
                      </HorizontalItemList>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </a>
    </Link>
  )
}

export default PlaybookCard
