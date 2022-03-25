import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { HtmlEditor } from '../../shared/HtmlEditor'
import { descriptionByLocale } from '../../../lib/utilities'
import Breadcrumb from '../../shared/breadcrumb'

const CREATE_TASK = gql`
mutation ($playSlug: String!, $name: String!, $description: String!, $resources: JSON!, $order: Int!) {
  createMove(play: $playSlug, name: $name, description: $description, resources: $resources, order: $order) {
    move {
      id
      name
      slug
      resources
      moveDescription {
        description
      }
      playName
      playSlug
    }
  }
}
`

export const MoveForm = ({ move, action }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { locale } = useRouter()

  const [createMove, { data, loading }] = useMutation(CREATE_TASK) // {update: updateCache}

  const [playSlug, setPlaySlug] = useState(move ? move.playSlug : '')
  const [name, setName] = useState(move ? move.name : '')
  const [description, setDescription] = useState(move ? descriptionByLocale(move.moveDescriptions, locale) : '')
  const [resources, setResources] = useState(move ? move.resources.map((resource, i) => ({ ...resource, i: i })) : [])

  const router = useRouter()

  const slugNameMapping = (() => {
    const map = {}
    if (move) {
      map[move.playSlug] = move.playName
      map[move.slug] = move.name
    }

    return map
  })()

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push(`/${locale}/plays/${data.createMove.move.playSlug}`)
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

  const handleResourceChange = (e, i) => {
    if (e.target.getAttribute('name') === 'resourceName') {
      setResources(resources.map(resource => resource.i === i ? { ...resource, name: e.target.value } : resource))
    } else if (e.target.getAttribute('name') === 'resourceDesc') {
      setResources(resources.map(resource => resource.i === i ? { ...resource, description: e.target.value } : resource))
    } else {
      setResources(resources.map(resource => resource.i === i ? { ...resource, url: e.target.value } : resource))
    }
  }

  const addResource = (e) => {
    e.preventDefault()
    setResources([...resources, { name: '', description: '', i: resources.length }])
  }

  const deleteResource = (e, i) => {
    e.preventDefault()
    setResources(resources.map(phase => phase.i === i ? { name: '', description: '' } : phase))
  }

  const doUpsert = async e => {
    e.preventDefault()
    const submitResources = resources.map(resource => resource.name === '' ? null : resource)
    createMove({ variables: { playSlug, name, description, resources: submitResources, order: 1, locale } })
  }

  return (
    <div className='pt-4'>
      <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-emerald-500'>{action === 'create' ? format('play.created') : format('play.updated')}</div>
      </div>
      <div className='p-3 font-semibold text-gray'>
        {format('moves.forPlay')}: {playSlug}
      </div>
      <div className='px-4'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
        {action === 'update' && format('app.edit-entity', { entity: move.name })}
      </div>
      <div id='content' className='px-4 sm:px-0 max-w-full mx-auto'>
        <form onSubmit={doUpsert}>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <div className='mb-4'>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('moves.name')}
              </label>
              <input
                id='name' name='name' type='text' placeholder={format('moves.name.placeholder')}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                value={name} onChange={(e) => handleTextFieldChange(e, setName)}
              />
            </div>
            <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
              {format('moves.description')}
            </label>
            <HtmlEditor updateText={setDescription} initialContent={description} />
            {resources && resources.map((resource, i) => {
              return (
                <div key={i} className='inline'>
                  <input
                    id={'resourceName' + i} name='resourceName' type='text' placeholder={format('resource.name')}
                    className='inline w-1/4 shadow appearance-none border rounded py-2 px-3 text-grey-darker'
                    value={resource.name} onChange={(e) => handleResourceChange(e, i)}
                  />
                  <input
                    id={'resourceDesc' + i} name='resourceDesc' type='text' placeholder={format('resource.description')}
                    className='inline w-1/4 shadow appearance-none border rounded py-2 px-3 text-grey-darker'
                    value={resource.description} onChange={(e) => handleResourceChange(e, i)}
                  />
                  <input
                    id={'resourceUrl' + i} name='resourceUrl' type='text' placeholder={format('resource.url')}
                    className='inline w-1/4 shadow appearance-none border rounded py-2 px-3 text-grey-darker'
                    value={resource.url} onChange={(e) => handleResourceChange(e, i)}
                  />
                  <button
                    className='inline bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                    onClick={(e) => deleteResource(e, i)} disabled={loading}
                  >
                    {format('moves.deleteResource')}
                  </button>
                </div>
              )
            })}
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                onClick={addResource} disabled={loading}
              >
                {format('moves.addResource')}
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
