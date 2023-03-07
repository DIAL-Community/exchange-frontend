import React, { useState, useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import classNames from 'classnames'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import Select from '../shared/Select'
import { ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { CREATE_PROJECT } from '../../mutations/project'
import { PRODUCT_SEARCH_QUERY } from '../../queries/product'
import { ORGANIZATION_SEARCH_QUERY } from '../../queries/organization'
import { Loading, Unauthorized } from '../shared/FetchStatus'
import { useUser, useProductOwnerUser, useOrganizationOwnerUser } from '../../lib/hooks'

const ProjectForm = React.memo(({ project }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = project?.slug ?? ''

  const router = useRouter()
  const { user, isAdminUser, loadingUserSession } = useUser()

  const { data: productsData } = useQuery(PRODUCT_SEARCH_QUERY, {
    variables: { search: '' },
    skip: !isAdminUser
  })

  const {
    loadingOwnedProducts,
    ownsAnyProduct,
    ownsSomeProduct,
    ownedProducts
  } = useProductOwnerUser(null, project?.products, loadingUserSession || isAdminUser)

  const productOptions = (isAdminUser ? productsData?.products : ownedProducts)?.map(
    ({ id, slug, name }) => ({
      label: name,
      value: parseInt(id),
      slug
    })
  ) ?? []

  const { data: organizationsData } = useQuery(ORGANIZATION_SEARCH_QUERY, {
    variables: { search: '' },
    skip: !isAdminUser
  })

  const {
    ownsAnyOrganization,
    ownsSomeOrganization,
    ownedOrganization
  } = useOrganizationOwnerUser(null, project?.organizations)

  const organizationOptions = organizationsData?.organizations?.map(
    ({ id, slug, name }) => ({
      label: name,
      value: parseInt(id),
      slug
    })
  ) ?? []

  const isAuthorized =
    isAdminUser || (project ? (ownsSomeProduct || ownsSomeOrganization) : (ownsAnyProduct || ownsAnyOrganization))

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const { locale } = useRouter()

  const [updateProject, { reset }] = useMutation(CREATE_PROJECT, {
    onCompleted: (data) => {
      const { createProject: response } = data
      if (response?.project && response?.errors?.length === 0) {
        setMutating(false)
        showToast(
          format('project.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          () => router.push(`/${router.locale}/projects/${response?.project?.slug}`)
        )
      } else {
        setMutating(false)
        showToast(format('project.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{format('project.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: project?.name,
      startDate: project?.startDate ?? null,
      endDate: project?.endDate ?? null,
      projectUrl: project?.projectWebsite,
      description: project?.projectDescription?.description
    }
  })

  const startDate = watch('startDate')

  const isEndDateValid = (endDate) => !startDate || !endDate || (endDate >= startDate)

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (project) {
      map[project.slug] = project.name
    }

    return map
  }, [project, format])

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const { name, startDate, endDate, projectUrl, description, organization, product } = data
      const variables = {
        name,
        slug,
        startDate: startDate || null,
        endDate: endDate || null,
        projectUrl,
        description
      }
      if (!slug) {
        variables.organizationId = (!isAdminUser && ownsAnyOrganization) ? ownedOrganization.id : organization?.value
        variables.productId = product?.value
      }

      updateProject({
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
    router.push(`/projects/${project?.slug ?? ''}`)
  }

  return (
    (loadingUserSession || loadingOwnedProducts) ? <Loading /> : isAuthorized ? (
      <div className='flex flex-col'>
        <div className='hidden lg:block px-8'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='pb-8 px-8'>
          <div id='content' className='sm:px-0 max-w-full mx-auto'>
            <form onSubmit={handleSubmit(doUpsert)}>
              <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
                <div className='text-2xl font-bold text-dial-blue pb-4'>
                  {project
                    ? format('app.edit-entity', { entity: project.name })
                    : `${format('app.create-new')} ${format('project.label')}`
                  }
                </div>
                <div className='flex flex-col lg:flex-row gap-4'>
                  <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                    <div className='flex flex-col gap-y-2 mb-2' data-testid='project-name'>
                      <label className='text-xl text-dial-blue required-field' htmlFor='name'>
                        {format('project.name')}
                      </label>
                      <Input
                        {...register('name', { required: format('validation.required') })}
                        id='name'
                        placeholder={format('project.name')}
                        isInvalid={errors.name}
                      />
                      {errors.name && <ValidationError value={errors.name?.message} />}
                    </div>
                    <div className='flex flex-col gap-y-2 mb-2'>
                      <label className='text-xl text-dial-blue'>
                        {format('project.startDate')}
                      </label>
                      <Input
                        {...register('startDate')}
                        type='date'
                        placeholder={format('project.startDate')}
                      />
                    </div>
                    <div className='flex flex-col gap-y-2 mb-2'>
                      <label className='text-xl text-dial-blue'>
                        {format('project.endDate')}
                      </label>
                      <Input
                        {...register(
                          'endDate',
                          { validate:
                              (endDate) =>
                                isEndDateValid(endDate) ||
                                format('validation.endDateEarlierThanStartDate')
                          }
                        )}
                        type='date'
                        placeholder={format('project.endDate')}
                        isInvalid={errors.endDate}
                      />
                      {errors.endDate && <ValidationError value={errors.endDate?.message} />}
                    </div>
                    <div className='flex flex-col gap-y-2 mb-2'>
                      <label className='text-xl text-dial-blue'>
                        {format('project.url')}
                      </label>
                      <Input {...register('projectUrl')} placeholder={format('project.url')} />
                    </div>
                    {!slug && (isAdminUser || ownsAnyProduct) && (
                      <div className='flex flex-col gap-y-2 mb-2' data-testid='project-product'>
                        <label className={classNames(
                          { 'required-field': ownsAnyProduct },
                          'text-xl text-dial-blue'
                        )}>
                          {format('project.product')}
                        </label>
                        <Controller
                          name='product'
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isSearch
                              options={productOptions}
                              placeholder={format('project.product')}
                              isInvalid={errors.product}
                            />
                          )}
                          rules={ownsAnyProduct && { required: format('validation.required') }}
                        />
                        {errors.product &&
                          <ValidationError value={errors.product?.message} />
                        }
                      </div>
                    )}
                    {!slug && (isAdminUser || ownsAnyOrganization) && (
                      <div className='flex flex-col gap-y-2 mb-2' data-testid='project-organization'>
                        <label className='text-xl text-dial-blue'>
                          {format('project.organization')}
                        </label>
                        {isAdminUser ? (
                          <Controller
                            name='organization'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isSearch
                                options={organizationOptions}
                                placeholder={format('project.organization')}
                              />
                            )}
                          />
                        ) : ownsAnyOrganization && (
                          <Input
                            value={ownedOrganization?.name}
                            placeholder={format('project.organization')}
                            disabled
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className='w-full lg:w-1/2'>
                    <div className='block flex flex-col gap-y-2' data-testid='project-description'>
                      <label className='text-xl text-dial-blue required-field'>
                        {format('project.description')}
                      </label>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <HtmlEditor
                            editorId='description-editor'
                            onChange={onChange}
                            initialContent={value}
                            placeholder={format('project.description')}
                            isInvalid={errors.description}
                          />
                        )}
                        rules={{ required: format('validation.required') }}
                      />
                      {errors.description &&
                        <ValidationError value={errors.description?.message} />
                      }
                    </div>
                  </div>
                </div>
                <div className='flex flex-wrap text-xl mt-8 gap-3'>
                  <button
                    type='submit'
                    className='submit-button'
                    disabled={mutating || reverting}
                    data-testid='submit-button'
                  >
                    {`${format('app.submit')} ${format('project.label')}`}
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
            </form>
          </div>
        </div>
      </div>
    ) : <Unauthorized />
  )
})

ProjectForm.displayName = 'ProjectForm'

export default ProjectForm
