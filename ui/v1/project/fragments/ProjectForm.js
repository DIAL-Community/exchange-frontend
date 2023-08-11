import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_PROJECT } from '../../shared/mutation/project'
import { REBRAND_BASE_PATH } from '../../utils/constants'
import IconButton from '../../shared/form/IconButton'
import UrlInput from '../../shared/form/UrlInput'
import Checkbox from '../../shared/form/Checkbox'

const ProjectForm = React.memo(({ project }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = project?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateProject, { reset }] = useMutation(CREATE_PROJECT, {
    onCompleted: (data) => {
      if (data.createProject.project && data.createProject.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${router.locale}/projects/${data.createProject.project.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showToast(format('project.submit.success'), 'success', 'top-center', 1000, null, redirectHandler)
      } else {
        setMutating(false)
        showToast(format('project.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('project.submit.failure'), 'error', 'top-center')
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: project?.name,
      aliases: project?.aliases?.length ? project?.aliases.map((value) => ({ value })) : [{ value: '' }],
      website: project?.website,
      description: project?.projectDescription?.description,
      commercialProject: project?.commercialProject,
      hostingModel: project?.hostingModel,
      pricingModel: project?.pricingModel,
      pricingDetails: project?.pricingDetails,
      pricingUrl: project?.pricingUrl
    }
  })

  const { fields: aliases, append, remove } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])
  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        imageFile,
        website,
        description,
        aliases,
        commercialProject,
        pricingUrl,
        hostingModel,
        pricingModel,
        pricingDetails
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        aliases: aliases.map(({ value }) => value),
        website,
        description,
        commercialProject,
        pricingUrl,
        hostingModel,
        pricingModel,
        pricingDetails
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
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
    router.push(`${REBRAND_BASE_PATH}/projects/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser ?
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {project
                ? format('app.editEntity', { entity: project.name })
                : `${format('app.createNew')} ${format('ui.project.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
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
            <div className='flex flex-col gap-y-2'>
              <label>{format('project.aliases')}</label>
              {aliases.map((alias, aliasIdx) => (
                <div key={alias.id} className='flex gap-x-2'>
                  <Input {...register(`aliases.${aliasIdx}.value`)} placeholder={format('project.alias')} />
                  {isLastAlias(aliasIdx) &&
                    <IconButton
                      className='bg-dial-meadow'
                      icon={<FaPlus className='text-sm' />}
                      onClick={() => append({ value: '' })}
                    />
                  }
                  {!isSingleAlias &&
                    <IconButton
                      className='bg-dial-meadow'
                      icon={<FaMinus className='text-sm' />}
                      onClick={() => remove(aliasIdx)}
                    />
                  }
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='website'>
                {format('project.website')}
              </label>
              <Controller
                id='website'
                name='website'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput value={value} onChange={onChange} id='website' placeholder={format('project.website')} />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label>{format('project.imageFile')}</label>
              <FileUploader {...register('imageFile')} />
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field'>{format('project.description')}</label>
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
              {errors.description && <ValidationError value={errors.description?.message} />}
            </div>
            <hr className='my-3' />
            <div className='text-2xl font-semibold pb-4'>{format('project.pricingInformation')}</div>
            <label className='flex gap-x-2 mb-2 items-center self-start'>
              <Checkbox {...register('commercialProject')} />
              {format('project.commercialProject')}
            </label>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='pricingUrl'>
                {format('project.pricingUrl')}
              </label>
              <Controller
                name='pricingUrl'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput
                    value={value}
                    onChange={onChange}
                    id='pricingUrl'
                    placeholder={format('project.pricingUrl')}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='hostingModel'>
                {format('project.hostingModel')}
              </label>
              <Input {...register('hostingModel')} id='hostingModel' placeholder={format('project.hostingModel')} />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='pricingModel'>
                {format('project.pricingModel')}
              </label>
              <Input {...register('pricingModel')} id='pricingModel' placeholder={format('project.pricingModel')} />
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label>{format('project.pricing.details')}</label>
              <Controller
                name='pricingDetails'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='pricing-details-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('project.pricing.details')}
                    isInvalid={errors.pricingDetails}
                  />
                )}
              />
            </div>
            <div className='flex flex-wrap text-base mt-6 gap-3'>
              <button type='submit' className='submit-button' disabled={mutating || reverting}>
                {`${format('app.submit')} ${format('ui.project.label')}`}
                {mutating && <FaSpinner className='spinner ml-3' />}
              </button>
              <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
                {format('app.cancel')}
                {reverting && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </div>
      </form>
      : <Unauthorized />
})

ProjectForm.displayName = 'ProjectForm'

export default ProjectForm
