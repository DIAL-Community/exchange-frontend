import { memo, useCallback, useContext, useState } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Checkbox from '../../shared/form/Checkbox'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_RESOURCE } from '../../shared/mutation/resource'
import { AUTHOR_SEARCH_QUERY } from '../../shared/query/author'
import { ORGANIZATION_SEARCH_QUERY } from '../../shared/query/organization'
import {
  PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY, RESOURCE_TYPE_SEARCH_QUERY
} from '../../shared/query/resource'
import { RESOURCE_TOPIC_SEARCH_QUERY } from '../../shared/query/resourceTopic'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const ResourceAuthor = ({ authors, setAuthors, mutating, reverting, register, getValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [searchingAuthor, setSearchingAuthor] = useState(true)

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
        { id: author.id, name: author.name, email: author.email, slug: author.slug }
      ]
    ]))
  }

  const appendAuthor = () => {
    setAuthors((authors) => ([
      ...authors,
      { name: getValues('authorName'), email: getValues('authorEmail') }
    ]))
  }

  return (
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
        <div className='flex flex-col gap-y-3 border px-6 pb-6 pt-4'>
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
  )
}

const ResourceSourceStructure = ({ sourceStructure, setSourceStructure, mutating, reverting, register, getValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [creatingSource, setCreatingSource] = useState(true)

  const toggleCreatingSource = (e) => {
    e.preventDefault()
    setCreatingSource(!creatingSource)
  }

  const fetchedOrganizationsCallback = (data) => (
    data.organizations?.map((organization) => ({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      label: organization.name,
      website: organization.website
    }))
  )

  const removeSourceStructure = () => {
    setSourceStructure(null)
  }

  const updateSourceStructure = () => {
    setSourceStructure({
      name: getValues('sourceName'),
      website: getValues('sourceWebsite'),
      logoFile: getValues('sourceLogoFile')
    })
  }

  const selectSourceStructure = (selectedSourceStructure) => {
    setSourceStructure(selectedSourceStructure)
  }

  return (
    <div className='flex flex-col'>
      <ul className="flex flex-wrap gap-x-4 -mb-px">
        <li className="me-2">
          <a
            href='#'
            onClick={toggleCreatingSource}
            className={classNames(
              'inline-block py-3 border-b-2',
              creatingSource ? 'border-dial-sunshine' : 'border-transparent'
            )}
          >
            {format('ui.resource.toggle.searchSourceStructure')}
          </a>
        </li>
        <li className="me-2">
          <a
            href='#'
            onClick={toggleCreatingSource}
            className={classNames(
              'inline-block py-3 border-b-2',
              creatingSource ? 'border-transparent' : 'border-dial-sunshine'
            )}
          >
            {format('ui.resource.toggle.createSourceStructure')}
          </a>
        </li>
      </ul>
      {creatingSource &&
        <div className='flex flex-col gap-y-3 border px-6 pb-6 pt-4'>
          <label className='flex flex-col gap-y-2'>
            {format('ui.organization.label')}
            <Select
              async
              isSearch
              isBorderless
              defaultOptions
              cacheOptions
              placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
              loadOptions={(input) =>
                fetchSelectOptions(client, input, ORGANIZATION_SEARCH_QUERY, fetchedOrganizationsCallback)
              }
              noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.organization.label') })}
              onChange={selectSourceStructure}
              value={null}
            />
          </label>
          {sourceStructure &&
            <div className='flex'>
              <Pill
                label={sourceStructure.name}
                onRemove={() => removeSourceStructure()}
              />
            </div>
          }
          <div className='text-xs italic text-dial-stratos'>
            {format('ui.resource.source.logoAsAlt')}
          </div>
        </div>
      }
      {!creatingSource &&
        <div className='flex flex-col gap-y-3 border px-6 pb-6 pt-4'>
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='sourceName'>
              {format('ui.source.name')}
            </label>
            <Input
              {...register('sourceName')}
              id='sourceName'
              placeholder={format('ui.source.name')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='sourceWebsite'>
              {format('ui.source.website')}
            </label>
            <Input
              {...register('sourceWebsite')}
              id='sourceWebsite'
              placeholder={format('ui.source.website')}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='sourceLogoFile'>
              {format('ui.source.imageFile')}
            </label>
            <FileUploader
              {...register('sourceLogoFile')}
              id='sourceLogoFile'
            />
          </div>
          <button
            type='button'
            className='submit-button ml-auto'
            disabled={mutating || reverting}
            onClick={updateSourceStructure}
          >
            {format('ui.resource.source.add')}
            {reverting && <FaSpinner className='spinner ml-3' />}
          </button>
          {sourceStructure &&
            <div className='flex'>
              <Pill
                label={sourceStructure.name}
                onRemove={() => removeSourceStructure()}
              />
            </div>
          }
          <div className='text-xs italic text-dial-stratos'>
            {format('ui.resource.source.logoAsAlt')}
          </div>
        </div>
      }
    </div>
  )
}

const ResourceForm = memo(({ resource, organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = resource?.slug ?? ''

  const client = useApolloClient()

  const { user } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)
  const [usingFile, setUsingFile] = useState(true)

  const [authors, setAuthors] = useState(() => (resource?.authors ?? []))
  const [sourceStructure, setSourceStructure] = useState(() => {
    if (resource?.source) {
      return {
        id: resource.source.id,
        name: resource.source.name,
        slug: resource.source.slug,
        label: resource.source.name,
        website: resource.source.website
      }
    }
  })

  const [resourceTopics, setResourceTopics] = useState(() => (resource?.resourceTopics ?? []))

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale, asPath } = router

  const [resourceType, setResourceType] = useState({ value: resource?.resourceType, label: resource?.resourceType })
  const fetchedResourceTypesCallback = (data) => (
    data.resourceTypes?.map((resourceType) => ({
      value: resourceType.name,
      label: resourceType.name
    }))
  )

  const [updateResource, { reset }] = useMutation(CREATE_RESOURCE, {
    refetchQueries: [{
      query: RESOURCE_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_RESOURCES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      if (data.createResource.resource && data.createResource.errors.length === 0) {
        const pathPrefix = asPath.indexOf('/hub') >= 0 ? '/hub/resources' : '/resources'
        const redirectPath = `${pathPrefix}/${data.createResource.resource.slug}`
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
      linkDescription: resource?.linkDescription
    }
  })

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const {
      name,
      description,
      showInWizard,
      showInExchange,
      publishedDate,
      featured,
      resourceLink,
      linkDescription,
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
      sourceName: sourceStructure?.name,
      sourceWebsite: sourceStructure?.website,
      resourceType: resourceType?.value,
      resourceTopics: resourceTopics?.map(({ name }) => name),
      authors: authors?.map(({ name, email }) => ({ name, email }))
    }

    if (sourceStructure?.logoFile) {
      variables.sourceLogoFile = sourceStructure.logoFile[0]
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
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/resources/${slug}`)
  }

  const toggleUsingFile = (e) => {
    e.preventDefault()
    setUsingFile(!usingFile)
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
        { id: resourceTopic.id, name: resourceTopic.name, slug: resourceTopic.slug }
      ]
    ]))
  }

  return (
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
            <Select
              async
              isSearch
              isBorderless
              defaultOptions
              cacheOptions
              placeholder={format('ui.resource.resourceType')}
              loadOptions={(input) =>
                fetchSelectOptions(client, input, RESOURCE_TYPE_SEARCH_QUERY, fetchedResourceTypesCallback)
              }
              noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.resource.resourceTopic') })}
              onChange={(value) => setResourceType(value)}
              value={resourceType}
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
          <ResourceSourceStructure
            mutating={mutating}
            reverting={reverting}
            sourceStructure={sourceStructure}
            setSourceStructure={setSourceStructure}
            register={register}
            getValues={getValues}
          />
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='required-field'>
              {format('ui.resource.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('ui.resource.description')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <hr className='h-px border-dashed' />
          <ResourceAuthor
            authors={authors}
            setAuthors={setAuthors}
            mutating={mutating}
            reverting={reverting}
            register={register}
            getValues={getValues}
          />
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
})

ResourceForm.displayName = 'ResourceForm'

export default ResourceForm
