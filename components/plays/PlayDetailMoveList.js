import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import PlayPreviewMove from './PlayPreviewMove'

const PlayDetailMoveList = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const slugNameMapping = (() => {
    const map = {}
    map[play.slug] = play.name

    return map
  })()

  return (
    <>
      <div className='flex flex-col gap-3 pb-8 max-w-screen-lg'>
        <div className='flex'>
          <div className='hidden lg:block'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
        </div>
        <div className='font-semibold text-2xl py-3'>
          {`${format('plays.label')}: ${play.name}`}
        </div>
        <div className='flex flex-col gap-3'>
          {
            play.playMoves.map((move, i) =>
              <PlayPreviewMove key={i} playSlug={play.slug} moveSlug={move.slug} moveName={move.name} />
            )
          }
        </div>
      </div>
    </>
  )
}

export default PlayDetailMoveList
