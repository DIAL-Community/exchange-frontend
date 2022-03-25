import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { useSession } from 'next-auth/client'
import { HtmlEditor } from '../shared/HtmlEditor'
import { TagAutocomplete, TagFilters } from '../filter/element/Tag'
import Breadcrumb from '../shared/breadcrumb'

const CREATE_PLAY = gql`
mutation ($name: String!, $slug: String!, $description: String!, $tags: JSON!) {
  createPlay(name: $name, slug: $slug, description: $description, tags: $tags) {
    play {
      id
      name
      slug
      tags
      playDescription {
        id
        description
      }
      playMoves {
        id
        name
        moveDescription {
          id
          description
        }
      }
    }
    errors
  }
}
`

export const FormTextEditor = ({ control, name }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <label className='block text-xl text-dial-blue flex flex-col gap-y-2'>
      {format(`plays.${name}`)}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <HtmlEditor
              editorId={`${name}-editor`}
              onBlur={onBlur}
              onChange={onChange}
              initialContent={value}
            />
          )
        }}
      />
    </label>
  )
}

export const PlayForm = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [createPlay, { data }] = useMutation(CREATE_PLAY)

  const router = useRouter()
  const [session] = useSession()

  const { locale } = router
  const [slug] = useState(play ? play.slug : '')
  const [tags, setTags] = useState(
    play ? play.tags.map(tag => { return { label: tag, value: tag } }) : []
  )

  const { handleSubmit, register, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: play && play.name,
      description: play && play.playDescription?.description
    }
  })

  useEffect(() => {
    if (data && data.createPlay.errors.length === 0 && data.createPlay.play) {
      setMutating(false)
      setTimeout(() => {
        router.push(`/${locale}/plays/${data.createPlay.play.slug}`)
      }, 500)
    }
  }, [data])

  const doUpsert = async (data) => {
    if (session) {
      setMutating(true)

      const { userEmail, userToken } = session.user
      const { name, description } = data

      createPlay({
        variables: {
          name,
          slug,
          description,
          tags: tags.map(tag => tag.label)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    let route = '/plays'
    if (play) {
      route = `${route}/${play.slug}`
    }

    router.push(route)
  }

  const slugNameMapping = (() => {
    const map = {}
    if (play) {
      map[play.slug] = play.name
    }

    map.edit = format('app.edit')
    map.create = format('app.create')

    return map
  })()

  return (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className={`mx-4 ${(data && data.createPlay.play) ? 'visible' : 'hidden'} text-center pt-4`}>
                <div className='my-auto text-emerald-500'>
                  {play ? format('play.created') : format('play.updated')}
                </div>
              </div>
              <div className={`mx-4 ${(data && data.createPlay.errors.length > 0) ? 'visible' : 'hidden'} text-center pt-4`}>
                <div className='my-auto text-red-500'>{format('play.error')}</div>
              </div>
              <div className='text-2xl font-bold text-dial-blue pb-4'>
                {play && format('app.edit-entity', { entity: play.name })}
                {!play && `${format('app.create-new')} ${format('plays.label')}`}
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/3 flex flex-col gap-y-3'>
                  <label className='flex flex-col gap-y-2 text-xl text-dial-blue mb-2'>
                    {format('plays.name')}
                    <input
                      {...register('name', { required: true })}
                      className='shadow border-1 rounded w-full py-2 px-3'
                    />
                  </label>
                  <div className='flex flex-col gap-y-2'>
                    <label className='text-xl text-dial-blue' htmlFor='name'>
                      {format('plays.tags')}
                      <TagAutocomplete {...{ tags, setTags }} containerStyles='pb-2' controlSize='100%' />
                    </label>
                    <div className='flex flex-wrap gap-1'>
                      <TagFilters {...{ tags, setTags }} />
                    </div>
                  </div>
                </div>
                <div className='w-full lg:w-2/3' style={{ minHeight: '20rem' }}>
                  <FormTextEditor control={control} name='description' />
                </div>
              </div>
              <div className='flex font-semibold text-xl lg:mt-8 gap-3'>
                <button
                  type='submit'
                  className='bg-blue-500 text-dial-gray-light py-3 px-8 rounded disabled:opacity-50'
                  disabled={mutating || reverting}
                >
                  {`${format('plays.submit')} ${format('plays.label')}`}
                  {mutating && <FaSpinner className='spinner ml-3 inline' />}
                </button>
                <button
                  type='button'
                  className='bg-button-gray-light text-white py-3 px-8 rounded disabled:opacity-50'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3 inline' />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
