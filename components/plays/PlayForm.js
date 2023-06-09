import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { HtmlEditor } from '../shared/HtmlEditor'
import { TagAutocomplete, TagFilters } from '../filter/element/Tag'
import Breadcrumb from '../shared/breadcrumb'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import Input from '../shared/Input'
import ValidationError from '../shared/ValidationError'
import { AUTOSAVE_PLAY, CREATE_PLAY } from '../../mutations/play'
import Select from '../shared/Select'
import { PRODUCT_SEARCH_QUERY } from '../../queries/product'
import Pill from '../shared/Pill'
import { fetchSelectOptions } from '../../queries/utils'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../queries/building-block'
import { useUser } from '../../lib/hooks'

export const PlayForm = ({ playbook, play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const router = useRouter()
  const { locale } = router
  const { user } = useUser()
  const { showToast } = useContext(ToastContext)

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const fetchedProductsCallback = (data) => (
    data?.products?.map((product) => ({
      label: product.name,
      slug: product.slug
    }))
  )

  const fetchedBuildingBlocksCallback = (data) => (
    data?.buildingBlocks?.map((buildingBlock) => ({
      label: buildingBlock.name,
      slug: buildingBlock.slug
    }))
  )

  const [createPlay, { reset }] = useMutation(CREATE_PLAY, {
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    },
    onCompleted: () => {
      setMutating(false)
      showToast(
        format('play.submitted'),
        'success',
        'top-center',
        DEFAULT_AUTO_CLOSE_DELAY,
        null,
        () => router.push(`/${locale}/playbooks/${playbook.slug}`)
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
        showToast(format('play.autoSaved'), 'success', 'top-right')
      }
    }
  })

  const [slug, setSlug] = useState(play?.slug ?? '')
  const [tags, setTags] = useState(play?.tags.map(tag => ({ label: tag })) ?? [])
  const [products, setProducts] = useState(
    play?.products?.map(
      product => ({ name: product.name, slug: product.slug })) ??
    []
  )
  const [buildingBlocks, setBuildingBlocks] = useState(
    play?.buildingBlocks?.map(
      buildingBlock => ({ name: buildingBlock.name, slug: buildingBlock.slug })) ??
    []
  )

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: play?.name,
      description: play?.playDescription?.description
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const { userEmail, userToken } = user
      const { name, description } = data
      const variables = {
        name,
        slug,
        description,
        tags: tags.map(tag => tag.label),
        playbookSlug: playbook.slug,
        productSlugs: products.map(({ slug }) => slug),
        buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug)
      }

      createPlay({
        variables,
        context: {
          headers: {
            'Accept-Language': router.locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  useEffect(() => {
    const doAutoSave = () => {
      const { locale } = router

      if (!user || !watch) {
        return
      }

      setMutating(true)

      const { userEmail, userToken } = user
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
        tags: tags.map(tag => tag.label),
        playbookSlug: playbook.slug,
        productSlugs: products.map(({ slug }) => slug),
        buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug)
      }

      autoSavePlay({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }

    const interval = setInterval(() => {
      doAutoSave()
    }, 60000)

    return () => clearInterval(interval)
  }, [user, slug, tags, products, buildingBlocks, playbook, router, watch, autoSavePlay])

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${router.locale}/playbooks/${playbook.slug}`)
  }

  const slugNameMapping = (() => {
    const map = {}

    map[play?.slug] = play?.name
    map[playbook?.slug] = playbook?.name

    map.edit = format('app.edit')
    map.create = format('app.create')

    return map
  })()

  const addProduct =
    (product) =>
      setProducts([
        ...products.filter(({ slug }) => slug !== product.slug),
        { name: product.label, slug: product.slug }
      ])

  const removeProduct =
    (product) =>
      setProducts([
        ...products.filter(({ slug }) => slug !== product.slug)
      ])

  const addBuildingBlock =
    (buildingBlock) =>
      setBuildingBlocks([
        ...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug),
        { name: buildingBlock.label, slug: buildingBlock.slug }
      ])

  const removeBuildingBlock =
    (buildingBlock) =>
      setBuildingBlocks([
        ...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug)
      ])

  return (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                {play && format('app.edit-entity', { entity: play.name })}
                {!play && `${format('app.create-new')} ${format('plays.label')}`}
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/3 flex flex-col gap-y-3' data-testid='play-name'>
                  <label className='flex flex-col gap-y-2 text-dial-sapphire mb-2'>
                    <p className='required-field'>{format('plays.name')}</p>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      placeholder={format('plays.name')}
                      isInvalid={errors.name}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </label>
                  <div className='flex flex-col gap-y-2' data-testid='play-tags'>
                    <label className='text-dial-sapphire flex flex-col gap-y-2' htmlFor='name'>
                      {format('plays.tags')}
                      <TagAutocomplete
                        {...{ tags, setTags }}
                        controlSize='100%'
                        placeholder={format('play.form.tags')}
                      />
                    </label>
                    <div className='flex flex-wrap gap-3 mt-2'>
                      <TagFilters {...{ tags, setTags }} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-y-2' data-testid='play-products'>
                    <label className='text-dial-sapphire flex flex-col gap-y-2'>
                      {format('plays.products')}
                      <Select
                        async
                        isSearch
                        defaultOptions
                        cacheOptions
                        placeholder={format('play.form.products')}
                        loadOptions={
                          (input) =>
                            fetchSelectOptions(
                              client,
                              input,
                              PRODUCT_SEARCH_QUERY,
                              fetchedProductsCallback
                            )
                        }
                        noOptionsMessage={() =>
                          format('filter.searchFor', { entity: format('product.header') })
                        }
                        onChange={addProduct}
                        value={null}
                      />
                    </label>
                    <div className='flex flex-wrap gap-3 mt-2'>
                      {products?.map((product, productIdx) =>(
                        <Pill
                          key={`product-${productIdx}`}
                          label={product.name}
                          onRemove={() => removeProduct(product)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className='flex flex-col gap-y-2' data-testid='play-buildingBlocks'>
                    <label className='text-dial-sapphire flex flex-col gap-y-2'>
                      {format('plays.buildingBlocks')}
                      <Select
                        async
                        isSearch
                        defaultOptions
                        cacheOptions
                        placeholder={format('play.form.buildingBlocks')}
                        loadOptions={
                          (input) =>
                            fetchSelectOptions(
                              client,
                              input,
                              BUILDING_BLOCK_SEARCH_QUERY,
                              fetchedBuildingBlocksCallback
                            )
                        }
                        noOptionsMessage={() =>
                          format('filter.searchFor', { entity: format('buildingBlocks.header') })
                        }
                        onChange={addBuildingBlock}
                        value={null}
                      />
                    </label>
                    <div className='flex flex-wrap gap-3 mt-2'>
                      {buildingBlocks?.map((buildingBlock, buildingBlockIdx) =>(
                        <Pill
                          key={`buildingBlock-${buildingBlockIdx}`}
                          label={buildingBlock.name}
                          onRemove={() => removeBuildingBlock(buildingBlock)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className='w-full lg:w-2/3'
                  style={{ minHeight: '20rem' }}
                  data-testid='play-description'
                >
                  <label className='block text-dial-sapphire flex flex-col gap-y-2'>
                    <p className='required-field'> {format('plays.description')}</p>
                    <Controller
                      name='description'
                      control={control}
                      rules={{ required: format('validation.required') }}
                      render={({ field: { value, onChange, onBlur } }) => {
                        return (
                          <HtmlEditor
                            editorId={`${name}-editor`}
                            onBlur={onBlur}
                            onChange={onChange}
                            initialContent={value}
                            isInvalid={errors.description}
                          />
                        )
                      }}
                    />
                    {errors.description &&
                      <ValidationError value={errors.description?.message} />
                    }
                  </label>
                </div>
              </div>
              <div className='flex flex-wrap font-semibold text-xl lg:mt-8 gap-3'>
                <button
                  type='submit'
                  data-testid='submit-button'
                  className='submit-button'
                  disabled={mutating || reverting}
                >
                  {`${format('play.submitAndAssign')} ${format('plays.label')}`}
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
          </form>
        </div>
      </div>
    </div>
  )
}
