import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'
import Input from '../shared/Input'
import ValidationError from '../shared/ValidationError'
import Dialog, { DialogType } from '../shared/Dialog'
import { CREATE_TAG } from '../../mutations/tag'
import { HtmlEditor } from '../shared/HtmlEditor'
import { useUser } from '../../lib/hooks'

const TagForm = ({ isOpen, onClose, tag }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { user } = useUser()

  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [updateTag, { called: isSubmitInProgress, reset }] = useMutation(CREATE_TAG, {
    refetchQueries: ['SearchTags'],
    onCompleted: (data) => {
      const { createTag: response } = data
      if (response?.tag && response?.errors?.length === 0) {
        showToast(format('toast.tag.submit.success'), 'success', 'top-center')
        onClose(true)
      } else {
        showToast(format('toast.tag.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: (error) => {
      showToast(
        <div className='flex flex-col'>
          <span>{format('toast.tag.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: tag?.name,
      description: (tag?.tagDescription?.description) ?? ''
    }
  })

  const slug = tag?.slug ?? ''

  const doUpsert = async (data) => {
    if (user) {
      const { userEmail, userToken } = user
      const { name, description } = data

      updateTag({
        variables: {
          name,
          description,
          slug
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

  return (
    <Dialog
      submitButton
      cancelButton
      isOpen={isOpen}
      onClose={onClose}
      formId='tag-form'
      isSubmitInProgress={isSubmitInProgress}
      dialogType={DialogType.FORM}
    >
      <div className='w-full'>
        <form onSubmit={handleSubmit(doUpsert)} id='tag-form'>
          <div className='pb-12 mb-4 flex flex-col gap-3'>
            <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
              {tag
                ? format('app.edit-entity', { entity: tag.name })
                : `${format('app.create-new')} ${format('tag.label')}`
              }
            </div>
            <div className='flex flex-col gap-y-2 mb-2' data-testid='tag-name'>
              <label className='text-dial-sapphire required-field' htmlFor='name'>
                {format('app.name')}
              </label>
              <Input
                {...register('name', { required: format('validation.required') })}
                id='name'
                placeholder={format('app.name')}
                isInvalid={errors.name}
              />
              {errors.name && <ValidationError value={errors.name?.message} />}
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label className='text-dial-sapphire'>
                {format('app.description')}
              </label>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='description-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('app.description')}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

export default TagForm
