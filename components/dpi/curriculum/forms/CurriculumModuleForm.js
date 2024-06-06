import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useActiveTenant, useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import Input from '../../../shared/form/Input'
import Pill from '../../../shared/form/Pill'
import Select from '../../../shared/form/Select'
import ValidationError from '../../../shared/form/ValidationError'
import { AUTOSAVE_PLAY, CREATE_PLAY } from '../../../shared/mutation/play'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../shared/query/buildingBlock'
import { PRODUCT_SEARCH_QUERY } from '../../../shared/query/product'
import { TAG_SEARCH_QUERY } from '../../../shared/query/tag'
import { fetchSelectOptions } from '../../../utils/search'

export const CurriculumModuleForm = ({ curriculum, curriculumModule }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { tenant } = useActiveTenant()

  const router = useRouter()
  const { user, loadingUserSession } = useUser()
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
        format('dpi.curriculum.module.submitted'),
        () => router.push(`/dpi-curriculum/${curriculum.slug}`)
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
        showSuccessMessage(format('dpi.curriculum.module.autoSaved'))
      }
    }
  })

  const [slug, setSlug] = useState(curriculumModule?.slug ?? '')
  const [tags, setTags] = useState(curriculumModule?.tags.map(tag => ({ label: tag })) ?? [])
  const [products, setProducts] = useState(
    curriculumModule?.products?.map(product => ({ name: product.name, slug: product.slug })) ?? []
  )
  const [buildingBlocks, setBuildingBlocks] = useState(
    curriculumModule?.buildingBlocks?.map(buildingBlock => ({ name: buildingBlock.name, slug: buildingBlock.slug })) ?? []
  )

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: curriculumModule?.name,
      description: curriculumModule?.playDescription?.description
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
        owner: 'dpi',
        tags: tags.map(tag => tag.label),
        playbookSlug: curriculum.slug,
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
        owner: 'dpi',
        tags: tags.map(tag => tag.label),
        playbookSlug: curriculum.slug,
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
  }, [user, slug, tenant, tags, products, buildingBlocks, curriculum, router, watch, autoSavePlay])

  const cancelForm = () => {
    setReverting(true)
    router.push(`/dpi-curriculum/${curriculum.slug}`)
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

  const fetchedProductsCallback = (data) => (
    data?.products?.map((product) => ({
      value: product.slug,
      label: product.name,
      slug: product.slug
    }))
  )

  const addProduct = (product) =>
    setProducts([
      ...products.filter(({ slug }) => slug !== product.slug),
      { name: product.label, slug: product.slug }
    ])

  const removeProduct = (product) =>
    setProducts([...products.filter(({ slug }) => slug !== product.slug)])

  const loadProductOptions = (input) =>
    fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchedProductsCallback)

  const fetchedBuildingBlocksCallback = (data) => (
    data?.buildingBlocks?.map((buildingBlock) => ({
      value: buildingBlock.slug,
      label: buildingBlock.name,
      slug: buildingBlock.slug
    }))
  )

  const addBuildingBlock =(buildingBlock) =>
    setBuildingBlocks([
      ...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug),
      { name: buildingBlock.label, slug: buildingBlock.slug }
    ])

  const removeBuildingBlock = (buildingBlock) =>
    setBuildingBlocks([...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug)])

  const loadBuildingBlockOptions = (input) =>
    fetchSelectOptions(client, input, BUILDING_BLOCK_SEARCH_QUERY, fetchedBuildingBlocksCallback)

  return loadingUserSession
    ? <Loading />
    : user?.isAdminUser || user?.isEditorUser || user?.isAdliAdminUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {curriculumModule && format('app.editEntity', { entity: curriculumModule.name })}
                {!curriculumModule && `${format('app.createNew')} ${format('dpi.curriculum.module.label')}`}
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
                  {tags?.map((tag, tagIdx) =>(
                    <Pill
                      key={tagIdx}
                      label={tag.label}
                      onRemove={() => removeTag(tag)}
                    />
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='flex flex-col gap-y-2'>
                  {format('ui.product.header')}
                  <Select
                    async
                    isBorderless
                    defaultOptions
                    cacheOptions
                    placeholder={format('ui.product.header')}
                    loadOptions={loadProductOptions}
                    noOptionsMessage={() =>
                      format('filter.searchFor', { entity: format('ui.product.header') })
                    }
                    onChange={addProduct}
                    value={null}
                  />
                </label>
                <div className='flex flex-wrap gap-3 mt-2'>
                  {products?.map((product, productIdx) =>(
                    <Pill
                      key={productIdx}
                      label={product.name}
                      onRemove={() => removeProduct(product)}
                    />
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='flex flex-col gap-y-2'>
                  {format('ui.buildingBlock.header')}
                  <Select
                    async
                    isBorderless
                    defaultOptions
                    cacheOptions
                    placeholder={format('ui.buildingBlock.header')}
                    loadOptions={loadBuildingBlockOptions}
                    noOptionsMessage={() =>
                      format('filter.searchFor', { entity: format('ui.buildingBlock.header') })
                    }
                    onChange={addBuildingBlock}
                    value={null}
                  />
                </label>
                <div className='flex flex-wrap gap-3 mt-2'>
                  {buildingBlocks?.map((buildingBlock, buildingBlockIdx) =>(
                    <Pill
                      key={buildingBlockIdx}
                      label={buildingBlock.name}
                      onRemove={() => removeBuildingBlock(buildingBlock)}
                    />
                  ))}
                </div>
              </div>
              <label className='flex flex-col gap-y-2'>
                <p className='required-field'> {format('ui.play.description')}</p>
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
                {errors.description && <ValidationError value={errors.description?.message} />}
              </label>
              <div className='flex flex-wrap gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                >
                  {`${format('dpi.curriculum.save')} ${format('dpi.curriculum.module.label')}`}
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
      : <Unauthorized />
}

export default CurriculumModuleForm
