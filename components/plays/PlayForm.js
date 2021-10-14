import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useMutation } from "@apollo/react-hooks"
import gql from 'graphql-tag'

import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'

import { HtmlEditor } from '../shared/HtmlEditor'
import { descriptionByLocale } from '../../lib/utilities'

const CREATE_PLAY = gql`
mutation ($name: String!, $slug: String!, $description: String!, $locale: String!) {
  createPlay(name: $name, slug: $slug, description: $description, locale: $locale) {
    play {
      id
      name
      slug
      playDescriptions {
        description
        locale
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
  const [slug, setSlug] = useState(play ? play.slug : '')
  const [description, setDescription] = useState(play ? descriptionByLocale(play.playDescriptions, locale) : '')

  const router = useRouter()

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push(`/${locale}/plays`)
      }, 2000)
    }
  }, [data])

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const doUpsert = async e => {
    e.preventDefault()
    createPlay({variables: {name, slug, description, locale }});
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
