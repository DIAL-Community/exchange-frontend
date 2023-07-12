import Link from 'next/link'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
import HorizontalItemList from '../shared/HorizontalItemList'
const collectionPath = convertToKey('Playbooks')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const PlaybookCard = ({ playbook, listType, newTab = false, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const isPlaybookPublished = !playbook.draft

  const listDisplayType = () =>
    <div className={`${containerElementStyle}`}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='relative flex flex-row gap-x-2 lg:gap-x-4 px-4 py-6'>
          <div className='w-10/12 lg:w-6/12 flex gap-3 text-dial-gray-dark my-auto'>
            <div className='block w-8 relative'>
              <Image
                fill
                className='object-contain'
                data-tooltip-id='react-tooltip'
                data-tooltip-content={format(
                  'tooltip.forEntity',
                  { entity: format('playbooks.label'), name: playbook.name }
                )}
                alt={format('image.alt.logoFor', { name: playbook.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
              />
            </div>
            <div className='ml-2 mt-0.5 w-full h-3/5 font-semibold line-clamp-1'>
              {playbook.name}
            </div>
          </div>
          <div className='flex gap-1.5 text-sm lg:ml-auto'>
            <HorizontalItemList
              itemBgClassname='bg-dial-alice-blue'
              restTooltipMessage={
                format('tooltip.ellipsisFor', { entity: format('playbooks.label') })
              }
            >
              {playbook.tags.map((tag, tagIdx) => (
                <div
                  key={`playbook-${tagIdx}`}
                  className='bg-dial-alice-blue px-2 py-1.5 rounded'
                >
                  {tag}
                </div>
              ))}
            </HorizontalItemList>
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
          <div className='relative'>
            <div className='absolute top-1 right-2'>
              <div className='text-sm font-semibold my-auto text-dial-angel'>
                {canEdit && !isPlaybookPublished && format('playbook.status.draft')}
              </div>
              <div className='text-sm font-semibold my-auto text-dial-lavender'>
                {canEdit && isPlaybookPublished && format('playbook.status.published')}
              </div>
            </div>
          </div>
          <div className='flex text-dial-sapphire bg-dial-alice-blue h-20 rounded-t-lg'>
            <div className='px-4 text-sm text-center font-semibold m-auto'>
              {playbook.name}
            </div>
          </div>
          <div className='mx-auto py-6'>
            <img
              className='object-contain h-20 w-20'
              layout='fill'
              alt={format('image.alt.logoFor', { name: playbook.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + playbook.imageFile}
              data-testid={`playbook-card-image-${playbook.id}`}
            />
          </div>
          <div className='bg-dial-alice-blue flex flex-col h-44 rounded-b-md'>
            <div className='px-3 py-3 text-sm line-clamp-4'>
              <div className='line-clamp-4'>
                {playbook.playbookDescription && parse(playbook.playbookDescription.overview)}
              </div>
            </div>
            {playbook?.tags.length > 0 && (
              <div className='flex flex-col bg-dial-alice-blue px-3 pb-3 text-sm gap-1'>
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

  return (
    !newTab
      ? <Link href={`/${collectionPath}/${playbook.slug}`}>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </Link>
      : <a href={`/${collectionPath}/${playbook.slug}`} target='_blank' rel='noreferrer' role='menuitem'>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </a>
  )
}

export default PlaybookCard
