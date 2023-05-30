import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { FiMove } from 'react-icons/fi'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlViewer } from '../shared/HtmlViewer'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import ProductCard from '../products/ProductCard'
import { useUser } from '../../lib/hooks'
import EditButton from '../shared/EditButton'
import CreateButton from '../shared/CreateButton'
import PlayPreviewMove from './PlayPreviewMove'
import RearrangeMoves from './RearrangeMoves'

const PlayDetail = ({ playbook, play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  const [displayDragable, setDisplayDragable] = useState(false)

  const { user } = useUser()
  const canEdit = user?.isAdminUser || user?.isEditorUser

  const generateEditLink = () => {
    if (!canEdit) {
      return '/edit-not-available'
    }

    return `/${locale}/playbooks/${playbook.slug}/plays/${play.slug}/edit`
  }

  const generateAddMoveLink = () => {
    if (!canEdit) {
      return '/add-move-not-available'
    }

    return `/${locale}/playbooks/${playbook.slug}/plays/${play.slug}/moves/create`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[play.slug] = play.name
    map[playbook.slug] = playbook.name

    return map
  })()

  return (
    <>
      <div className='flex flex-col gap-3 pb-8 max-w-screen-lg'>
        <div className='flex mt-4'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
          <div className='ml-auto my-auto'>
            { canEdit && <EditButton type='link' href={generateEditLink()} />}
          </div>
        </div>
        <div className='font-semibold text-2xl py-3'>
          {`${format('plays.label')}: ${play.name}`}
        </div>
        <HtmlViewer
          initialContent={play?.playDescription?.description}
          editorId='play-detail'
          className='-mt-4'
        />
        <div className='flex flex-col gap-3'>
          <div className='flex gap-2 ml-auto'>
            {canEdit &&
              <CreateButton
                label={format('move.add')}
                type='link'
                href={generateAddMoveLink()}
              />
            }
            {canEdit &&
              <button
                type='button'
                onClick={() => setDisplayDragable(!displayDragable)}
                className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-white'
              >
                <FiMove className='inline pb-0.5' />
                <span className='text-sm px-1'>
                  {format('move.rearrange')}
                </span>
              </button>
            }
          </div>
          {play.playMoves.map((move, i) =>
            <>
              <PlayPreviewMove
                key={i}
                playSlug={play.slug}
                moveSlug={move.slug}
                moveName={move.name}
                playbookSlug={playbook.slug}
              />
              <RearrangeMoves
                play={play}
                displayDragable={displayDragable}
                setDisplayDragable={setDisplayDragable}
              />
            </>
          )}
        </div>
        {play.buildingBlocks && play.buildingBlocks.length > 0 &&
          <div className='flex flex-col gap-3 my-3'>
            <div className='h4'>{format('building-block.header')}</div>
            <div
              className='text-sm'
              dangerouslySetInnerHTML={{ __html: format('play.buildingBlocks.subtitle') }}
            />
            {play.buildingBlocks.map((bb, i) =>
              <BuildingBlockCard key={i} buildingBlock={bb} listType='list' />
            )}
          </div>
        }
        {play.products && play.products.length > 0 &&
          <div className='flex flex-col gap-3 my-3'>
            <div className='h4'>{format('product.header')}</div>
            <div
              className='text-sm'
              dangerouslySetInnerHTML={{ __html: format('play.products.subtitle') }}
            />
            {play.products.map((product, i) =>
              <ProductCard key={i} product={product} listType='list' />
            )}
          </div>
        }
      </div>
    </>
  )
}

export default PlayDetail
