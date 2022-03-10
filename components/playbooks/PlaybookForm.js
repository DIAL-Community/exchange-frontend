import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'

import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'

import { Controller, useForm } from 'react-hook-form'

import { TagAutocomplete, TagFilters } from '../filter/element/Tag'
import { HtmlEditor } from '../../components/shared/HtmlEditor'
import { descriptionByLocale } from '../../lib/utilities'
import DraggablePlayList from '../../components/plays/DraggablePlayList'

import dynamic from 'next/dynamic'
const PlayListQuery = dynamic(() => import('../../components/plays/PlayList'), { ssr: false })

const CREATE_PLAYBOOK = gql`
mutation ($name: String!, $slug: String!, $overview: String!, $audience: String, $outcomes: String, $tags: JSON!, $plays: JSON!, $locale: String!) {
  createPlaybook(name: $name, slug: $slug, overview: $overview, audience: $audience, outcomes: $outcomes, tags: $tags, plays: $plays, locale: $locale) {
    playbook {
      id
      name
      slug
      tags
      playbookDescriptions {
        overview
        audience
        outcomes
      }
      plays {
        id
        name
      }
    }
    errors
  }
}
`

export const PlaybookForm = React.memo(({ playbook, action }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { locale } = useRouter()

  const [createPlaybook, { data, loading }] = useMutation(CREATE_PLAYBOOK)

  const { handleSubmit, register, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: playbook.name,
      overview: playbook && descriptionByLocale(playbook.playbookDescriptions, locale, 'overview'),
      audience: playbook && descriptionByLocale(playbook.playbookDescriptions, locale, 'audience'),
      outcomes: playbook && descriptionByLocale(playbook.playbookDescriptions, locale, 'outcomes')
    }
  })

  const [showPlayForm, setShowPlayForm] = useState(false)
  const [slug] = useState(playbook ? playbook.slug : '')
  const [tags, setTags] = useState(playbook ? playbook.tags.map(tag => { return { label: tag, value: tag } }) : [])
  const [plays, setPlays] = useState(playbook ? playbook.plays.map((play, i) => ({ ...play, order: i })) : [])

  const router = useRouter()

  useEffect(() => {
    if (data && data.createPlaybook.errors.length === 0 && data.createPlaybook.playbook) {
      setTimeout(() => {
        router.push(`/${locale}/playbooks/${data.createPlaybook.playbook.slug}`)
      }, 2000)
    }
  }, [data])

  const assignPlay = (e, play) => {
    e.preventDefault()
    setPlays([...plays, { ...play, order: plays.length }])
    setShowPlayForm(false)
  }

  const unassignPlay = (e, removePlay) => {
    e.preventDefault()
    setPlays(plays.map(play => play.name === removePlay.name ? { name: '', description: '' } : play))
  }

  const doUpsert = async (data, e) => {
    const { name, overview, audience, outcomes } = data
    const submitPlays = plays.map(play => play.name === '' ? null : play)
    createPlaybook({ variables: { name, slug, overview, audience, outcomes, tags: tags.map(tag => tag.name), plays: submitPlays, locale } })
  }

  return (
    <div className='py-8 px-8'>
      <div className={`mx-4 ${(data && data.createPlaybook.playbook) ? 'visible' : 'hidden'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{action === 'create' ? format('playbook.created') : format('playbook.updated')}</div>
      </div>
      <div className={`mx-4 ${(data && data.createPlaybook.errors.length > 0) ? 'visible' : 'hidden'} text-center pt-4`}>
        <div className='my-auto text-red-500'>format('playbook.error')</div>
      </div>
      <div className='text-2xl font-bold text-dial-blue pb-4'>
        {action === 'update' && format('app.edit-entity', { entity: playbook.name })}
      </div>
      <div id='content' className='sm:px-0 max-w-full mx-auto'>
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='bg-edit shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <div className='grid grid-cols-3'>
              <div className='col-span-1 pr-4'>
                <div className='mb-4'>
                  <label className='block text-xl text-dial-blue mb-2' htmlFor='name'>
                    {format('playbooks.name')}
                  </label>
                  <input {...register('name', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' />
                </div>
                <div className='mb-4'>
                  <label className='block text-xl text-dial-blue mb-2' htmlFor='name'>
                    {format('playbooks.tags')}
                  </label>
                  <TagAutocomplete {...{ tags, setTags }} containerStyles='pb-2' controlSize='100%' />
                  <div className='flex flex-cols-4'>
                    <TagFilters {...{ tags, setTags }} />
                  </div>
                </div>
              </div>
              <div className='col-span-2'>
                <label className='block text-xl text-dial-blue my-2' htmlFor='name'>
                  {format('playbooks.overview')}
                </label>
                <Controller
                  name='overview'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => {
                    return (
                      <HtmlEditor
                        editorId='overviewEditor'
                        onBlur={onBlur}
                        onChange={onChange}
                        initialContent={value}
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 mt-4'>
              <div className='pr-2'>
                <label className='block text-xl text-dial-blue my-2' htmlFor='name'>
                  {format('playbooks.audience')}
                </label>
                <Controller
                  name='audience'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => {
                    return (
                      <HtmlEditor
                        editorId='audienceEditor'
                        onBlur={onBlur}
                        onChange={onChange}
                        initialContent={value}
                      />
                    )
                  }}
                />
              </div>
              <div className='pl-2'>
                <label className='block text-xl text-dial-blue my-2' htmlFor='name'>
                  {format('playbooks.outcomes')}
                </label>
                <Controller
                  name='outcomes'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => {
                    return (
                      <HtmlEditor
                        editorId='outcomesEditor'
                        onBlur={onBlur}
                        onChange={onChange}
                        initialContent={value}
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div className='flex items-center justify-between text-xl text-dial-blue font-bold mt-8'>
              {format('playbooks.plays')}
            </div>
            <div className='flex items-center justify-between text-dial-blue mt-2'>
              {format('playbooks.assignedPlays')}
            </div>
            {showPlayForm && <PlayListQuery displayType='assign' assignCallback={assignPlay} currentPlays={plays} />}
            <div>
              <DraggablePlayList playList={plays} setPlayList={setPlays} />
            </div>
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                onClick={(e) => { e.preventDefault(); setShowPlayForm(true) }}
              >
                {format('playbooks.assignPlay')}
              </button>
            </div>
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                type='submit' disabled={loading}
              >
                {format('playbooks.submit')}
                {loading && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
})
