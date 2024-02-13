import React, { useCallback, useContext, useMemo, useState } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import Checkbox from '../../shared/form/Checkbox'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import { generateResourceTypeOptions } from '../../shared/form/options'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_RESOURCE } from '../../shared/mutation/resource'
import { AUTHOR_SEARCH_QUERY } from '../../shared/query/author'
import { PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import { RESOURCE_TOPIC_SEARCH_QUERY } from '../../shared/query/resourceTopic'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const ResourceForm = React.memo(({ resource, organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = resource?.slug ?? ''

  const client = useApolloClient()

  const { user, loadingUserSession } = useUser()
  const canEdit = user?.isAdminUser || user?.isEditorUser

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)
  const [usingFile, setUsingFile] = useState(true)

  const [searchingAuthor, setSearchingAuthor] = useState(true)
  const [authors, setAuthors] = useState(() => (resource?.authors ?? []))

  const [resourceTopics, setResourceTopics] = useState(() => (resource?.resourceTopics ?? []))

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const resourceTypeOptions = useMemo(() => generateResourceTypeOptions(format), [format])

  const [updateResource, { reset }] = useMutation(CREATE_RESOURCE, {
    refetchQueries: [{
      query: RESOURCE_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_RESOURCES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createResource.resource && data.createResource.errors.length === 0) {
        const redirectPath = `/${locale}/hub/${data.createResource.resource.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.resource.label') }),
          redirectHandler
        )
      } else {
        setMutating(false)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.label') }))
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.label') }))
      reset()
    }
  })

  const { handleSubmit, register, control, getValues, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: resource?.name,
      description: resource?.description,
      showInWizard: resource?.showInWizard,
      showInExchange: resource?.showInExchange,
      publishedDate: resource?.publishedDate,
      featured: resource?.featured,
      resourceLink: resource?.resourceLink,
      linkDescription: resource?.linkDescription,
      source: resource?.source,
      resourceType: resourceTypeOptions?.find(({ value: type }) => type === resource?.resourceType)
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        description,
        showInWizard,
        showInExchange,
        publishedDate,
        featured,
        resourceLink,
        linkDescription,
        source,
        resourceType,
        imageFile,
        resourceFile
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        description,
        showInWizard,
        showInExchange,
        publishedDate,
        featured,
        resourceLink,
        linkDescription,
        source,
        resourceType: resourceType?.value,
        resourceTopics: resourceTopics.map(({ name }) => name ),
        authors: authors.map(({ name, email }) => ({ name, email }))
      }

      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      if (resourceFile) {
        variables.resourceFile = resourceFile[0]
      }

      if (organization) {
        variables.organizationSlug = organization.slug
      }

      updateResource({
        variables,
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
    router.push(`/${locale}/hub/${slug}`)
  }

  const toggleUsingFile = (e) => {
    e.preventDefault()
    setUsingFile(!usingFile)
  }

  const toggleAddingAuthor = (e) => {
    e.preventDefault()
    setSearchingAuthor(!searchingAuthor)
  }

  const fetchedAuthorsCallback = (data) => (
    data.authors?.map((author) => ({
      id: author.id,
      name: author.name,
      slug: author.slug,
      label: author.name,
      email: author.email
    }))
  )

  const removeAuthor = (author) => {
    setAuthors((authors) => authors.filter(({ name }) => author.name !== name))
  }

  const addAuthor = (author) => {
    setAuthors((authors) => ([
      ...[
        ...authors.filter(({ id }) => id !== author.id),
        { id: author.id, name: author.name, email: author.email, slug: author.slug  }
      ]
    ]))
  }

  const appendAuthor = () => {
    setAuthors((authors) => ([
      ...authors,
      { name: getValues('authorName'), email: getValues('authorEmail') }
    ]))
  }

  const fetchedResourceTopicsCallback = (data) => (
    data.resourceTopics?.map((resourceTopic) => ({
      id: resourceTopic.id,
      name: resourceTopic.name,
      slug: resourceTopic.slug,
      label: resourceTopic.name
    }))
  )

  const removeResourceTopic = (resourceTopic) => {
    setResourceTopics((resourceTopics) => resourceTopics.filter(({ name }) => resourceTopic.name !== name))
  }

  const addResourceTopic = (resourceTopic) => {
    setResourceTopics((resourceTopics) => ([
      ...[
        ...resourceTopics.filter(({ id }) => id !== resourceTopic.id),
        { id: resourceTopic.id, name: resourceTopic.name, slug: resourceTopic.slug  }
      ]
    ]))
  }

  return loadingUserSession
    ? <Loading />
    : canEdit
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-stratos'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {resource
                  ? format('app.editEntity', { entity: resource.name })
                  : `${format('app.createNew')} ${format('ui.resource.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='name'>
                  {format('ui.resource.name')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.resource.name')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field'>
                  {format('ui.resource.publishedDate')}
                </label>
                <Input
                  {...register('publishedDate', { required: format('validation.required') })}
                  type='date'
                  placeholder={format('ui.resource.publishedDate')}
                  isInvalid={errors.publishedDate}
                  defaultValue={new Date().toISOString().substring(0, 10)}
                />
                {errors.publishedDate && <ValidationError value={errors.publishedDate?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className=''>
                  {format('ui.resource.imageFile')}
                </label>
                <FileUploader {...register('imageFile')} />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='resourceTopic'>
                  {format('ui.resource.resourceType')}
                </label>
                <Controller
                  name='resourceType'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isSearch
                      isBorderless
                      options={resourceTypeOptions}
                      placeholder={format('ui.resource.resourceType')}
                    />
                  )}
                />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='flex flex-col gap-y-2'>
                  {format('ui.resource.resourceTopic')}
                  <Select
                    async
                    isSearch
                    isBorderless
                    defaultOptions
                    cacheOptions
                    placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
                    loadOptions={(input) =>
                      fetchSelectOptions(client, input, RESOURCE_TOPIC_SEARCH_QUERY, fetchedResourceTopicsCallback)
                    }
                    noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.resource.resourceTopic') })}
                    onChange={addResourceTopic}
                    value={null}
                  />
                </label>
                <div className='flex flex-wrap gap-3'>
                  {resourceTopics.map((resourceTopic, resourceTopicIdx) => (
                    <Pill
                      key={`resource-topic-${resourceTopicIdx}`}
                      label={resourceTopic.name}
                      onRemove={() => removeResourceTopic(resourceTopic)}
                    />
                  ))}
                </div>
              </div>
              <div className='flex flex-col'>
                <ul className="flex flex-wrap gap-x-4 -mb-px">
                  <li className="me-2">
                    <a
                      href='#'
                      onClick={toggleUsingFile}
                      className={classNames(
                        'inline-block py-3 border-b-2',
                        usingFile ? 'border-dial-sunshine' : 'border-transparent'
                      )}
                    >
                      {format('ui.resource.toggle.resourceFile')}
                    </a>
                  </li>
                  <li className="me-2">
                    <a
                      href='#'
                      onClick={toggleUsingFile}
                      className={classNames(
                        'inline-block py-3 border-b-2',
                        usingFile ? 'border-transparent' : 'border-dial-sunshine'
                      )}
                    >
                      {format('ui.resource.toggle.resourceUrl')}
                    </a>
                  </li>
                </ul>
                {usingFile &&
                  <div className='flex flex-col gap-y-6 border px-6 pb-6 pt-4'>
                    <div className='flex flex-col gap-y-2'>
                      <label htmlFor='resourceFile'>
                        {format('ui.resource.resourceFile')}
                      </label>
                      <FileUploader
                        {...register('resourceFile')}
                        fileTypes={['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx']}
                        fileTypesDisclaimer='resource.supportedFormats'
                      />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                      <label className='required-field' htmlFor='linkDescription'>
                        {format('ui.resource.linkDescription')}
                      </label>
                      <Input
                        {...register('linkDescription', { required: format('validation.required') })}
                        id='linkDescription'
                        placeholder={format('ui.resource.linkDescription')}
                        isInvalid={errors.linkDescription}
                      />
                      {errors.linkDescription && <ValidationError value={errors.linkDescription?.message} />}
                    </div>
                  </div>
                }
                {!usingFile &&
                  <div className='flex flex-col gap-y-6 border px-6 pb-6 pt-4'>
                    <div className='flex flex-col gap-y-2'>
                      <label htmlFor='resourceLink'>
                        {format('ui.resource.resourceLink')}
                      </label>
                      <Controller
                        name='resourceLink'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <UrlInput
                            value={value}
                            onChange={onChange}
                            id='resourceLink'
                            placeholder={format('ui.resource.resourceLink')}
                          />
                        )}
                      />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                      <label className='required-field' htmlFor='linkDescription'>
                        {format('ui.resource.linkDescription')}
                      </label>
                      <Input
                        {...register('linkDescription', { required: format('validation.required') })}
                        id='linkDescription'
                        placeholder={format('ui.resource.linkDescription')}
                        isInvalid={errors.linkDescription}
                      />
                      {errors.linkDescription && <ValidationError value={errors.linkDescription?.message} />}
                    </div>
                  </div>
                }
              </div>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='source'>
                  {format('ui.resource.source')}
                </label>
                <Input
                  {...register('source')}
                  id='source'
                  placeholder={format('ui.resource.source')}
                  isInvalid={errors.source}
                />
                {errors.source && <ValidationError value={errors.source?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field'>
                  {format('ui.resource.description')}
                </label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <HtmlEditor
                      editorId='description-editor'
                      onChange={onChange}
                      initialContent={value}
                      placeholder={format('ui.resource.description')}
                      isInvalid={errors.description}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.description && <ValidationError value={errors.description?.message} />}
              </div>
              <hr className='h-px border-dashed' />
              <div className='flex flex-col'>
                <ul className="flex flex-wrap gap-x-4 -mb-px">
                  <li className="me-2">
                    <a
                      href='#'
                      onClick={toggleAddingAuthor}
                      className={classNames(
                        'inline-block py-3 border-b-2',
                        searchingAuthor ? 'border-dial-sunshine' : 'border-transparent'
                      )}
                    >
                      {format('ui.resource.toggle.searchAuthor')}
                    </a>
                  </li>
                  <li className="me-2">
                    <a
                      href='#'
                      onClick={toggleAddingAuthor}
                      className={classNames(
                        'inline-block py-3 border-b-2',
                        searchingAuthor ? 'border-transparent' : 'border-dial-sunshine'
                      )}
                    >
                      {format('ui.resource.toggle.addAuthor')}
                    </a>
                  </li>
                </ul>
                {searchingAuthor &&
                  <div className='flex flex-col gap-y-6 border px-6 pb-6 pt-4'>
                    <label className='flex flex-col gap-y-2'>
                      {`${format('app.searchAndAssign')} ${format('ui.resource.author.label')}`}
                      <Select
                        async
                        isSearch
                        isBorderless
                        defaultOptions
                        cacheOptions
                        placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
                        loadOptions={(input) =>
                          fetchSelectOptions(client, input, AUTHOR_SEARCH_QUERY, fetchedAuthorsCallback)
                        }
                        noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.resource.author.label') })}
                        onChange={addAuthor}
                        value={null}
                      />
                    </label>
                    <div className='flex flex-wrap gap-3'>
                      {authors.map((author, authorIdx) => (
                        <Pill
                          key={`author-${authorIdx}`}
                          label={author.name}
                          onRemove={() => removeAuthor(author)}
                        />
                      ))}
                    </div>
                  </div>
                }
                {!searchingAuthor &&
                  <div className='flex flex-col gap-y-6 border px-6 pb-6 pt-4'>
                    <div className='flex flex-col gap-y-2'>
                      <label htmlFor='authorName'>
                        {format('ui.resource.author.name')}
                      </label>
                      <Input
                        {...register('authorName')}
                        id='authorName'
                        placeholder={format('ui.resource.author.name')}
                      />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                      <label htmlFor='authorEmail'>
                        {format('ui.resource.author.email')}
                      </label>
                      <Input
                        {...register('authorEmail')}
                        id='authorEmail'
                        placeholder={format('ui.resource.author.email')}
                      />
                    </div>
                    <button
                      type='button'
                      className='submit-button ml-auto'
                      disabled={mutating || reverting}
                      onClick={appendAuthor}
                    >
                      {format('ui.resource.author.add')}
                      {reverting && <FaSpinner className='spinner ml-3' />}
                    </button>
                    <div className='flex flex-wrap gap-3'>
                      {authors.map((author, authorIdx) => (
                        <Pill
                          key={`author-${authorIdx}`}
                          label={author.name}
                          onRemove={() => removeAuthor(author)}
                        />
                      ))}
                    </div>
                  </div>
                }
              </div>
              {user?.isAdminUser &&
                <>
                  <hr className='h-px border-dashed' />
                  <div className='text-base text-dial-blueberry font-semibold'>
                    {format('app.adminOnly')}
                  </div>
                  <hr className='h-px border-dashed' />
                  <div className='flex flex-wrap'>
                    <label className='flex gap-x-2 items-center self-start basis-1/2 shrink-0'>
                      <Checkbox {...register('showInExchange')} />
                      {format('ui.resource.showInExchange')}
                    </label>
                    <label className='flex gap-x-2 items-center self-start basis-1/2 shrink-0'>
                      <Checkbox {...register('showInWizard')} />
                      {format('ui.resource.showInWizard')}
                    </label>
                  </div>
                  <hr className='h-px border-dashed' />
                  <div className='flex flex-wrap'>
                    <label className='flex gap-x-2 items-center self-start basis-1/2 shrink-0'>
                      <Checkbox {...register('featured')} />
                      {format('ui.resource.featured')}
                    </label>
                  </div>
                  <hr className='h-px border-dashed' />
                </>
              }
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating || reverting}>
                  {`${format('app.submit')} ${format('ui.resource.label')}`}
                  {mutating && <FaSpinner className='spinner ml-3' />}
                </button>
                <button
                  type='button'
                  className='cancel-button'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3' />}
                </button>
              </div>
            </div>
          </div>
        </form>
      )
      : <Unauthorized />
})

ResourceForm.displayName = 'ResourceForm'

export default ResourceForm
