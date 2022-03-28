import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import parse from 'html-react-parser'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { convertToKey } from '../context/FilterContext'
import { PlayPreviewDispatchContext } from './PlayPreviewContext'
import { PlayListContext, PlayListDispatchContext } from './PlayListContext'
import { SOURCE_TYPE_ASSIGNING } from './PlayList'
const collectionPath = convertToKey('Plays')

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

const PlayAsCard = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <Link href={`/${collectionPath}/${play.slug}`}>
      <div className='group border-3 border-transparent hover:border-dial-yellow cursor-pointer'>
        <div className='border border-dial-gray hover:border-transparent card-drop-shadow h-full'>
          <div className='flex flex-col h-full'>
            <div className='flex flex-col h-80 p-4 group-hover:text-dial-yellow'>
              <div className='text-2xl font-semibold absolute w-64 2xl:w-80'>
                {play.name}
              </div>
              <div className='mx-auto mt-5 pt-20 w-40 h-60'>
                <img
                  alt={format('image.alt.logoFor', { name: play.name })} className='workflow-filter'
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + play.imageFile}
                />
              </div>
            </div>
            <div className='h-20 bg-dial-gray-light'>
              {
                play.playDescription &&
                  <div className='px-3 py-3 text-sm'>
                    <div className='max-h-16 playbook-description overflow-hidden'>
                      {parse(play.playDescription?.description)}
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const PlayAsList = ({ playbook, play, sourceType }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()

  const { currentPlays } = useContext(PlayListContext)
  const { setCurrentPlays } = useContext(PlayListDispatchContext)
  const { setPreviewSlug, setPreviewDisplayed } = useContext(PlayPreviewDispatchContext)

  const [updatePlayOrder] = useMutation(UPDATE_PLAY_ORDER)

  const openPlayPreview = (play) => {
    setPreviewSlug(play.slug)
    setPreviewDisplayed(true)
  }

  const openPlayDetail = (play) => {
    router.push(`/plays/${play.slug}`)
  }

  const assignPlay = (play) => {
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
          {parse(play.playDescription?.description)}
        </div>
        {
          sourceType !== SOURCE_TYPE_ASSIGNING &&
            <button
              type='button'
              className='ml-auto bg-dial-orange-light text-dial-purple py-1 px-3 rounded disabled:opacity-50'
              onClick={() => openPlayDetail(play)}
            >
              {format('play.view')}
            </button>
        }
        {
          sourceType === SOURCE_TYPE_ASSIGNING &&
            <div className='w-2/6 my-auto flex gap-2 text-sm'>
              <button
                type='button'
                className='ml-auto bg-dial-orange-light text-dial-purple py-1.5 px-3 rounded disabled:opacity-50'
                onClick={() => openPlayPreview(play)}
              >
                {format('play.preview')}
              </button>
              <button
                type='button'
                className='bg-dial-blue text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50'
                onClick={() => assignPlay(play)}
              >
                {format('play.assign')}
              </button>
            </div>
        }
      </div>
    </div>
  )
}

const PlayCard = ({ playbook, play, displayType, sourceType }) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <>
      {displayType === 'list' && <PlayAsList playbook={playbook} play={play} sourceType={sourceType} />}
      {displayType !== 'list' && <PlayAsCard playbook={playbook} play={play} />}
    </>
  )
}

export default PlayCard
