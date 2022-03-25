import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import { descriptionByLocale } from '../../../lib/utilities'
import Breadcrumb from '../../shared/breadcrumb'

const MoveDetail = ({ move }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const { locale } = useRouter()
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/${locale}/plays/${move.playSlug}/moves/${move.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[move.playSlug] = move.playName
    map[move.slug] = move.name

    return map
  })()

  return (
    <div className='px-4'>
      <Breadcrumb slugNameMapping={slugNameMapping} />
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
      <div className='h4 font-bold py-4'>{format('plays.label')}</div>
      {format('moves.description')}
      <div className='fr-view tinyEditor text-dial-gray-dark'>
        {parse(descriptionByLocale(move.moveDescriptions, locale))}
      </div>
    </div>
  )
}

export default MoveDetail
