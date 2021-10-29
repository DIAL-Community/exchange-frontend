import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'

import { descriptionByLocale } from '../../../lib/utilities'
import { useRouter } from 'next/router'

const TaskDetail = ({ task }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const router = useRouter()
  const { locale } = useRouter()
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/${locale}/plays/${task.playSlug}/tasks/${task.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[play.slug] = task.playName
    map[task.slug] = task.name
    return map
  })()

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
        <div className='h4 font-bold py-4'>{format('plays.label')}</div>
      {format('tasks.description')}
      <div className='fr-view text-dial-gray-dark'>
        {ReactHtmlParser(descriptionByLocale(task.taskDescriptions, locale))}
      </div>
    </div>
  )
}

export default TaskDetail
