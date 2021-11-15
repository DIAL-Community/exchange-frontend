import { useIntl } from 'react-intl'
import ReactHtmlParser from 'react-html-parser'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

const PlayNavigator = ({ playList }) => {
  return (
    <div className='grid grid-cols-4'>
      <div>
        {playList && playList.map((play, i) => {
          return (
            <div key={i} className='border-2'>
              {play.name}
            </div>
          )
        })}
      </div>
      <div className='col-span-3'>
        {playList && playList.map((play, i) => {
          return (<PlayDetail key={i} play={play} />)
        })}
      </div>
    </div>
  )
}

const PlayDetail = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const { locale } = useRouter()

  return (
    <div className='px-4'>
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
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PlayNavigator
