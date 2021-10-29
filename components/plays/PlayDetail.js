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

  const addTask = () => {
    router.push(`/${locale}/plays/${play.slug}/tasks/create`)
  }

  const editTask = (e, taskSlug) => {
    router.push(`/${locale}/plays/${play.slug}/tasks/${taskSlug}/edit`)
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
        <div className='h4 font-bold py-4'>{format('plays.label')}</div>
      {format('plays.description')}
      <div className='fr-view text-dial-gray-dark'>
        {ReactHtmlParser(descriptionByLocale(play.playDescriptions, locale))}
      </div>
      <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
        {format('plays.tasks')}
      </label>
      { play.playTasks && play.playTasks.map((task, i) => {
          return (<div key={i} className='inline w-full'>
            {task.name}
            {ReactHtmlParser(descriptionByLocale(task.taskDescriptions, locale))}
            <button 
              className='flex-auto h-8 bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
              onClick={(e) => editTask(e, task.slug)}
            >
              {format('plays.editTask')}
            </button>
          </div>
        )
      })}
      <div className='flex items-center justify-between font-semibold text-sm mt-2'>
        <button
          className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
          onClick={addTask}
        >
          {format('plays.addTask')}
        </button>
      </div>
    </div>
  )
}

export default PlayDetail
