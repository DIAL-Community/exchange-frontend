import { useContext } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { gql, useMutation } from '@apollo/client'
import { PlayPreviewDispatchContext } from './PlayPreviewContext'
import { PlayListContext, PlayListDispatchContext } from './PlayListContext'
import { SOURCE_TYPE_ASSIGNING } from './PlayList'

const UPDATE_PLAY_ORDER = gql`
  mutation (
    $playbookSlug: String!,
    $playSlug: String!,
    $operation: String!,
    $distance: Int!
  ) {
    updatePlayOrder (
      playbookSlug: $playbookSlug,
      playSlug: $playSlug,
      operation: $operation,
      distance: $distance
    ) {
      play {
        id
        slug
      }
    }
  }
`

const PlayCard = ({ playbook, play, sourceType }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { currentPlays } = useContext(PlayListContext)
  const { setCurrentPlays } = useContext(PlayListDispatchContext)
  const { setPreviewSlug, setPreviewContext, setPreviewDisplayed } = useContext(PlayPreviewDispatchContext)

  const [updatePlayOrder] = useMutation(UPDATE_PLAY_ORDER)

  const openPlayPreview = (playbook, play) => {
    setPreviewSlug(play.slug)
    setPreviewContext(playbook.slug)
    setPreviewDisplayed(true)
  }

  const assignPlay = (playbook, play) => {
    setCurrentPlays([...currentPlays, play])
    if (playbook) {
      updatePlayOrder({
        variables: {
          playbookSlug: playbook.slug,
          playSlug: play.slug,
          operation: 'ASSIGN',
          distance: 0
        }
      })
    }
  }

  return (
    <div className='bg-white border border-dial-gray border-opacity-50 card-drop-shadow'>
      <div className='flex flex-row gap-4 px-3 py-4 h-16 w-full'>
        <div className='w-2/6 font-semibold my-auto whitespace-nowrap overflow-hidden text-ellipsis'>
          {play.name}
        </div>
        <div className='w-full playbook-list-description overflow-hidden fr-view my-1'>
          {play.playDescription && parse(play.playDescription.description)}
        </div>
        {
          sourceType === SOURCE_TYPE_ASSIGNING &&
            <div className='w-2/6 my-auto flex gap-2 text-sm'>
              <button
                type='button'
                className='ml-auto bg-dial-orange-light text-dial-purple py-1.5 px-3 rounded disabled:opacity-50'
                onClick={() => openPlayPreview(playbook, play)}
              >
                {format('play.preview')}
              </button>
              <button
                type='button'
                className='bg-dial-blue text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50'
                onClick={() => assignPlay(playbook, play)}
              >
                {format('play.assign')}
              </button>
            </div>
        }
      </div>
    </div>
  )
}

export default PlayCard
