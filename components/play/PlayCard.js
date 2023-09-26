import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { PlayListContext, PlayListDispatchContext } from './context/PlayListContext'

const PlayCard = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentPlays } = useContext(PlayListContext)
  const { setDirty, setCurrentPlays } = useContext(PlayListDispatchContext)

  const assignPlay = (play) => {
    setDirty(true)
    setCurrentPlays([...currentPlays, { id: play.id, slug: play.slug, name: play.name }])
  }

  return (
    <div className='bg-white border border-dial-gray border-opacity-50 shadow-md'>
      <div className='flex flex-row gap-4 px-3 py-4 h-16'>
        <div className='w-3/6 font-semibold my-auto whitespace-nowrap overflow-hidden text-ellipsis'>
          {play.name}
        </div>
        <div className='w-full line-clamp-1 fr-view my-1'>
          {play.playDescription && parse(play.playDescription.description)}
        </div>
        <div className='ml-auto my-auto text-sm'>
          <button
            type='button'
            className='bg-dial-sapphire text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50'
            onClick={() => assignPlay(play)}
          >
            {format('ui.play.assign')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayCard
