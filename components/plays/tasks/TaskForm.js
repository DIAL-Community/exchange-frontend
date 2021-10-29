import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useMutation } from "@apollo/react-hooks"
import gql from 'graphql-tag'

import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import ReactHtmlParser from 'react-html-parser'

import { HtmlEditor } from '../../shared/HtmlEditor'
import { descriptionByLocale } from '../../../lib/utilities'

const CREATE_TASK = gql`
mutation ($playSlug: String!, $name: String!, $description: String!, $order: Int!, $locale: String!) {
  createTask(play: $playSlug, name: $name, description: $description, order: $order, locale: $locale) {
    task {
      id
      name
      slug
      taskDescriptions {
        description
        locale
      }
      playName
      playSlug
    }
  }
}
`

export const TaskForm = ({task, action}) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { locale } = useRouter()

  const [createTask, { data, loading }] = useMutation(CREATE_TASK)  // {update: updateCache}

  const [playSlug, setPlaySlug] = useState(task ? task.playSlug : '' )
  const [name, setName] = useState(task ? task.name : '')
  const [description, setDescription] = useState(task ? descriptionByLocale(task.taskDescriptions, locale) : '')

  const router = useRouter()

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push(`/${locale}/plays/${task.playSlug}`)
      }, 2000)
    }
  }, [data])

  useEffect(() => {
    const { slug } = router.query
    setPlaySlug(slug)
  }, [router.query])

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const doUpsert = async e => {
    e.preventDefault()
    createTask({variables: {playSlug, name, description, order: 1, locale }});
  }

  return (
    <div className='pt-4'>
      <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{action == 'create' ? format('play.created') : format('play.updated')}</div>
      </div>
      <div className='p-3'>
        {format('tasks.forPlay')} : { playSlug }
      </div>
      {action == 'update' && format('app.edit-entity', { entity: task.name }) }
      <div id='content' className='px-4 sm:px-0 max-w-full mx-auto'>
        <form onSubmit={doUpsert}>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('tasks.name')}
              </label>
              <input
                id='name' name='name' type='text' placeholder={format('tasks.name.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={name} onChange={(e) => handleTextFieldChange(e, setName)}
              />
            </div>
            <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('tasks.description')}
            </label>
            <HtmlEditor updateText={setDescription} initialContent={description} />
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
