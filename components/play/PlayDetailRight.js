import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { FiMove } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import BuildingBlockCard from '../building-block/BuildingBlockCard'
import RearrangeMoves from '../move/RearrangeMoves'
import { PlaybookDetailDispatchContext } from '../playbook/context/PlaybookDetailContext'
import ProductCard from '../product/ProductCard'
import CreateButton from '../shared/form/CreateButton'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { DisplayType } from '../utils/constants'
import PlayPreviewMove from './PlayPreviewMove'
import UnassignPlay from './UnassignPlay'

const PlayDetailRight = ({ playbook, play, index = 0 }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const ref = useRef()
  const { locale } = useRouter()

  const { user } = useUser()
  const canEdit = user?.isAdminUser || user?.isEditorUser

  const { setSlugHeights } = useContext(PlaybookDetailDispatchContext)

  const [displayDraggable, setDisplayDraggable] = useState(false)
  const onDraggableClose = () => {
    setDisplayDraggable(false)
  }

  useEffect(() => {
    if (ref.current) {
      setSlugHeights(currentSlugHeights => {
        const heights = { ...currentSlugHeights }
        heights[play.slug] = ref.current.clientHeight

        return heights
      })
    }
  }, [play, setSlugHeights])

  const generateEditLink = () => {
    return `/${locale}/playbooks/${playbook.slug}/plays/${play.slug}/edit`
  }

  const generateAddMoveLink = () => {
    return `/${locale}/playbooks/${playbook.slug}/plays/${play.slug}/moves/create`
  }

  return (
    <div className='flex flex-col gap-y-4' ref={ref}>
      <div className='flex flex-wrap gap-3'>
        <div className='font-semibold text-2xl py-4'>
          {`${format('ui.play.label')} ${index + 1}. ${play.name}`}
        </div>
        <div className='ml-auto my-auto flex gap-2'>
          {canEdit && <EditButton type='link' href={generateEditLink()} />}
          {canEdit && <UnassignPlay playbookSlug={playbook.slug} playSlug={play.slug} />}
        </div>
      </div>
      <HtmlViewer
        initialContent={play?.playDescription?.description}
        editorId={`play-${index}-desc`}
      />
      <div className='flex flex-col gap-3'>
        <div className='flex gap-2 ml-auto'>
          {canEdit &&
            <CreateButton
              label={format('ui.move.add')}
              type='link'
              href={generateAddMoveLink()}
            />
          }
          {canEdit && play.playMoves.length > 0 &&
            <button
              type='button'
              onClick={() => setDisplayDraggable(!displayDraggable)}
              className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-white'
            >
              <FiMove className='inline pb-0.5' />
              <span className='text-sm px-1'>
                {format('ui.move.rearrange')}
              </span>
            </button>
          }
        </div>
        {play.playMoves.map((move, i) =>
          <div key={i}>
            <PlayPreviewMove
              playSlug={play.slug}
              moveSlug={move.slug}
              moveName={move.name}
              playbookSlug={playbook.slug}
            />
            <RearrangeMoves
              play={play}
              displayDraggable={displayDraggable}
              onDraggableClose={onDraggableClose}
            />
          </div>
        )}
      </div>
      {play.buildingBlocks && play.buildingBlocks.length > 0 &&
        <div className='flex flex-col gap-3'>
          <div className='text-xl font-semibold py-4'>{format('ui.buildingBlock.header')}</div>
          <div
            className='text-sm'
            dangerouslySetInnerHTML={{ __html: format('ui.play.buildingBlocks.subtitle') }}
          />
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
            {play.buildingBlocks.map((bb, bbIdx) =>
              <BuildingBlockCard key={bbIdx} buildingBlock={bb} displayType={DisplayType.SMALL_CARD} />)
            }
          </div>
        </div>
      }
      {play.products && play.products.length > 0 &&
        <div className='flex flex-col gap-3'>
          <div className='text-xl font-semibold py-4'>{format('ui.product.header')}</div>
          <div
            className='text-sm'
            dangerouslySetInnerHTML={{ __html: format('ui.play.products.subtitle') }}
          />
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
            {play.products.map((product, productIdx) =>
              <ProductCard key={productIdx} product={product} displayType={DisplayType.SMALL_CARD} />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default PlayDetailRight
