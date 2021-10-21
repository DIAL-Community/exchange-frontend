import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useMutation } from "@apollo/react-hooks"
import gql from 'graphql-tag'

import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'

import { HtmlEditor } from '../shared/HtmlEditor'
import { descriptionByLocale } from '../../lib/utilities'

const CREATE_PLAY = gql`
mutation ($name: String!, $description: String!, $tasks: JSON!, $locale: String!) {
  createPlay(name: $name, description: $description, tasks: $tasks, locale: $locale) {
    play {
      id
      name
      slug
      playDescriptions {
        description
        locale
      }
      playTasks {
        name
        taskDescriptions {
          description
          locale
        }
      }
    }
  }
}
`

export const PlayForm = ({play, action}) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { locale } = useRouter()

  const [createPlay, { data, loading }] = useMutation(CREATE_PLAY)  // {update: updateCache}

  const [name, setName] = useState(play ? play.name : '')
  const [description, setDescription] = useState(play ? descriptionByLocale(play.playDescriptions, locale) : '')
  const [tasks, setTasks] = useState(play ? play.playTasks.map((task,i)=> ({ ...task, i: i })) : [])

  const router = useRouter()

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push(`/${locale}/plays/${play.slug}`)
      }, 2000)
    }
  }, [data])

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const handleTaskChange = (e, i) => {
    if (e.target.getAttribute('name') == 'taskName') {
      setTasks(tasks.map(task => task.i == i ? {...task, name: e.target.value} : task))
    } 
  }

  const setTaskDesc = (desc, editorData) => {
    setTasks(tasks.map(task => task.id == editorData.id ? {...task, description: desc} : task))
  }

  const initDescEditor = (editor) => {
    setTasks(tasks.map((task, i, {length}) => (length - 1 === i) ? {...task, id: editor.id} : task))
  }

  const addTask = (e) => {
    e.preventDefault()
    setTasks([...tasks, {name: '', description: '', i: tasks.length}])
  }

  const doUpsert = async e => {
    e.preventDefault()
    createPlay({variables: {name, description, tasks, locale }});
  }

  return (
    <div className='pt-4'>
      <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{action == 'create' ? format('play.created') : format('play.updated')}</div>
      </div>
      {action == 'update' && format('app.edit-entity', { entity: play.name }) }
      <div id='content' className='px-4 sm:px-0 max-w-full mx-auto'>
        <form onSubmit={doUpsert}>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('plays.name')}
              </label>
              <input
                id='name' name='name' type='text' placeholder={format('plays.name.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={name} onChange={(e) => handleTextFieldChange(e, setName)}
              />
            </div>
            <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('plays.description')}
            </label>
            <HtmlEditor updateText={setDescription} initialContent={description} />
            <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('plays.tasks')}
            </label>
            { tasks && tasks.map((task, i) => {
              return (<div key={i} className='flex'>
                <input
                  id={'taskName'+i} name='taskName' type='text' placeholder={format('plays.task.name')}
                  className='flex-auto h-8 w-60 shadow appearance-none border rounded py-2 px-3 text-grey-darker'
                  value={task.name} onChange={(e) => handleTaskChange(e, i)}
                />
                <div className='flex-auto px-3'>
                  <HtmlEditor id={'taskDesc-'+i}  updateText={setTaskDesc} initialContent={task.description} initInstanceCallback={initDescEditor} />
                </div>
                <button 
                  className='flex-auto h-8 bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                  onClick={(e) => deleteTask(e, i)} disabled={loading}
                >
                  {format('plays.deleteTask')}
                </button>
              </div>)
              })
            }
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                onClick={addTask} disabled={loading}
              >
                {format('plays.addTask')}
              </button>
            </div>
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                type='submit' disabled={loading}
              >
                {format('plays.submit')}
                {loading && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
