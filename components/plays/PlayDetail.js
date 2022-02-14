import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

const PlayDetail = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const router = useRouter()
  const { locale } = useRouter()
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/${locale}/plays/${play.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[play.slug] = play.name
    return map
  })()

  const addMove = () => {
    router.push(`/${locale}/plays/${play.slug}/moves/create`)
  }

  const editMove = (e, moveSlug) => {
    router.push(`/${locale}/plays/${play.slug}/moves/${moveSlug}/edit`)
  }

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='w-full'>
        {
          session && (
            <div className='inline'>
              {
                session.user.canEdit && (
                  <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                    <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                    <span className='text-sm px-2'>{format('app.edit')}</span>
                  </a>
                )
              }
            </div>
          )
        }
      </div>
      <div className='h4 font-bold py-4'>{play.name}</div>
      <div className='h4'>
        {format('plays.description')}
      </div>
      <div className='fr-view tinyEditor text-dial-gray-dark px-4 py-2'>
        {ReactHtmlParser(descriptionByLocale(play.playDescriptions, locale))}
      </div>
      <div className='pb-4 h4'>{format('plays.tags')}: {play.tags}</div>
      <label className='block h4'>
        {format('plays.moves')}
      </label>
      {play.playMoves && play.playMoves.map((move, i) => {
        return (
          <div key={i} className='px-4 py-2'>
            <div className='inline w-full'>
              <div className='h4 inline'>{format('moves.name')}:</div> {move.name}
              <div className='tinyEditor px-3'>{ReactHtmlParser(descriptionByLocale(move.moveDescriptions, locale))}</div>
              <div className='px-3 py-2'><div className='h4'>{format('moves.resources')}</div>
                {move.resources && move.resources.map((resource, i) => {
                  return (
                    <div key={i} className='p-3 w-full'>
                      <a className='text-dial-yellow' href={resource.url} target='_blank' rel='noreferrer'>
                        {resource.name}
                      </a>
                      <div className='px-2'>{resource.description}</div>
                    </div>
                  )
                })}
              </div>
              <button
                className='bg-dial-gray-dark text-dial-gray-light text-sm py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                onClick={(e) => editMove(e, move.slug)}
              >
                {format('plays.editMove')}
              </button>
            </div>
          </div>
        )
      })}
      <div className='flex items-center justify-between text-sm mt-2'>
        <button
          className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
          onClick={addMove}
        >
          {format('plays.addMove')}
        </button>
      </div>
    </div>
  )
}

export default PlayDetail
