import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useActiveTenant } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { AUTOSAVE_PLAY, CREATE_PLAY } from '../../shared/mutation/play'
import { TAG_SEARCH_QUERY } from '../../shared/query/tag'
import { fetchSelectOptions } from '../../utils/search'

const PUBLISHED_CHECKBOX_FIELD_NAME = 'published'

export const PlayForm = ({ playbook, play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { tenant } = useActiveTenant()

  const router = useRouter()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [createPlay, { reset }] = useMutation(CREATE_PLAY, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: () => {
      setMutating(false)
      showSuccessMessage(
        format('ui.play.submitted'),
        () => router.push(`/playbooks/${playbook.slug}`)
      )
    }
  })

  const [autoSavePlay, { reset: resetAutoSave }] = useMutation(AUTOSAVE_PLAY, {
    onError: () => {
      setMutating(false)
      resetAutoSave()
    },
    onCompleted: (data) => {
      const { autoSavePlay: response } = data
      if (response.errors.length === 0 && response.play) {
        setMutating(false)
        setSlug(response.play.slug)
        showSuccessMessage(format('ui.play.autoSaved'))
      }
    }
  })

  const [slug, setSlug] = useState(play?.slug ?? '')
  const [tags, setTags] = useState(
    play
      ?.tags
      ?.map(tag => ({ label: tag }))
    ?? [])
  const [products] = useState(
    play
      ?.products
      ?.map(product => ({ name: product.name, slug: product.slug }))
    ?? []
  )
  const [buildingBlocks] = useState(
    play
      ?.buildingBlocks
      ?.map(buildingBlock => ({ name: buildingBlock.name, slug: buildingBlock.slug }))
    ?? []
  )

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: play?.name,
      published: !play?.draft ?? true,
      description: play?.playDescription?.description
    }
  })

  const doUpsert = async (data) => {
    setMutating(true)
    const { name, description, published } = data
    const variables = {
      name,
      slug,
      description,
      owner: 'public',
      draft: !published,
      tags: tags.map(tag => tag.label),
      playbookSlug: playbook.slug,
      productSlugs: products.map(({ slug }) => slug),
      buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug)
    }

    createPlay({
      variables,
      context: {
        headers: {
          'Accept-Language': router.locale
        }
      }
    })
  }

  useEffect(() => {
    const doAutoSave = () => {
      const { locale } = router

      if (!watch) {
        return
      }

      setMutating(true)

      const { name, description } = watch()
      if (!name || !description) {
        // Minimum required fields are name and description.
        setMutating(false)

        return
      }

      const variables = {
        name,
        slug,
        description,
        owner: 'public',
        tags: tags.map(tag => tag.label),
        playbookSlug: playbook.slug,
        productSlugs: products.map(({ slug }) => slug),
        buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug)
      }

      autoSavePlay({
        variables,
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }

    const interval = setInterval(() => {
      doAutoSave()
    }, 60000)

    return () => clearInterval(interval)
  }, [slug, tenant, tags, products, buildingBlocks, playbook, router, watch, autoSavePlay])

  const cancelForm = () => {
    setReverting(true)
    let route = '/playbooks'
    if (playbook) {
      route = `${route}/${playbook.slug}`
    }

    router.push(route)
  }

  const fetchedTagsCallback = (data) => (
    data?.tags?.map((tag) => ({
      value: tag.slug,
      label: tag.name,
      slug: tag.slug
    }))
  )

  const addTag = (tag) =>
    setTags([
      ...tags.filter(({ label }) => label !== tag.label),
      { label: tag.label, slug: tag.slug }
    ])

  const removeTag = (tag) =>
    setTags([...tags.filter(({ label }) => label !== tag.label)])

  const loadTagOptions = (input) =>
    fetchSelectOptions(client, input, TAG_SEARCH_QUERY, fetchedTagsCallback)

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {play && format('app.editEntity', { entity: play.name })}
            {!play && `${format('app.createNew')} ${format('ui.play.label')}`}
          </div>
          <label className='flex flex-col gap-y-2'>
            <p className='required-field'>{format('ui.play.name')}</p>
            <Input
              {...register('name', { required: format('validation.required') })}
              placeholder={format('ui.play.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </label>
          <div className='flex flex-col gap-y-2'>
            <label className='flex flex-col gap-y-2'>
              {format('ui.tag.header')}
              <Select
                async
                isBorderless
                defaultOptions
                cacheOptions
                placeholder={format('ui.tag.header')}
                loadOptions={loadTagOptions}
                noOptionsMessage={() =>
                  format('filter.searchFor', { entity: format('ui.tag.header') })
                }
                onChange={addTag}
                value={null}
              />
            </label>
            <div className='flex flex-wrap gap-3 mt-2'>
              {tags?.map((tag, tagIdx) => (
                <Pill
                  key={tagIdx}
                  label={tag.label}
                  onRemove={() => removeTag(tag)}
                />
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='required-field'>
              {format('ui.play.description')}
            </label>
            <Controller
              name='description'
              control={control}
              rules={{ required: format('validation.required') }}
              render={({ field: { value, onChange } }) => {
                return (
                  <HtmlEditor
                    labelledBy='description'
                    onChange={onChange}
                    initialContent={value}
                  />
                )
              }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <label className='flex gap-x-2 mb-2 items-center self-start'>
            <Checkbox {...register(PUBLISHED_CHECKBOX_FIELD_NAME)} />
            {format('ui.play.published')}
          </label>
          <div className='flex flex-wrap gap-3 text-sm'>
            <button
              type='submit'
              className='submit-button'
              disabled={mutating || reverting}
            >
              {`${format('app.save')} ${format('ui.play.label')}`}
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
            </button>
            <button
              type='button'
              className='cancel-button'
              disabled={mutating || reverting}
              onClick={cancelForm}
            >
              {format('app.cancel')}
              {reverting && <FaSpinner className='spinner ml-3 inline' />}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlayForm
