import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

const PlayNavigator = ({ playList }) => {
  return (
    <div>
      {playList && playList.map((play, i) => {
        return (<PlayDetail key={i} play={play} />)
      })}
    </div>
  )
}

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
      <div className='h4 font-bold py-4'>{play.name}</div>
      <div className='h4'>
        {format('plays.description')}
      </div>
      <div className='fr-view text-dial-gray-dark px-4 py-2'>
        {ReactHtmlParser(descriptionByLocale(play.playDescriptions, locale))}
      </div>
      <label className='block h4'>
        {format('plays.tasks')}
      </label>
      {play.playTasks && play.playTasks.map((task, i) => {
        return (
          <div key={i} className='px-4 py-2'>
            <div className='inline w-full'>
              {task.name}
              <div className='px-3'>{ReactHtmlParser(descriptionByLocale(task.taskDescriptions, locale))}</div>
              <div className='px-3 py-2'>{format('tasks.resources')}
                {task.resources && task.resources.map((resource, i) => {
                  return (
                    <div key={i} className='px-2 w-full'>
                      <div>{format('resource.name')}: {resource.name}</div>
                      <div>{format('resource.description')}: {resource.description}</div>
                      <div>{format('resource.url')}: {resource.url}</div>
                    </div>
                  )
                })}
              </div>
              <button
                className='bg-dial-gray-dark text-dial-gray-light text-sm py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                onClick={(e) => editTask(e, task.slug)}
              >
                {format('plays.editTask')}
              </button>
            </div>
          </div>
        )
      })}
      <div className='flex items-center justify-between text-sm mt-2'>
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

export default PlayNavigator
