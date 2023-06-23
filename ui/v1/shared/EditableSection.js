import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'
import EditButton from './form/EditButton'
import CreateButton from './form/CreateButton'

const EditableSection = ({
  canEdit,
  sectionHeader,
  editModeBody,
  displayModeBody,
  isDirty,
  isMutating,
  onSubmit,
  onCancel,
  createAction = null
}) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [isInEditMode, setIsInEditMode] = useState(false)
  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false)

  useEffect(() => {
    // if mutation has finished switch back to display mode
    if (isSubmitInProgress && !isMutating) {
      setIsInEditMode(false)
      setIsSubmitInProgress(false)
    }
  }, [isMutating]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex justify-between items-center'>
        {sectionHeader}
        <div className='gap-3'>
          {canEdit && !isInEditMode &&
            <EditButton onClick={() => setIsInEditMode(true)} className='mr-2' />
          }
          {createAction && canEdit && !isInEditMode &&
            <CreateButton label={format('app.create-new')} onClick={createAction} className='mr-2' />
          }
        </div>
      </div>
      {isInEditMode
        ? (
          <div className='bg-edit'>
            {editModeBody}
            <div className='px-6 py-4 flex justify-end gap-3'>
              <button
                type='submit'
                onClick={() => {
                  setIsSubmitInProgress(true)
                  onSubmit()
                }}
                className='submit-button'
                disabled={!isDirty || isSubmitInProgress}
                data-testid='submit-button'
              >
                {format(`${isSubmitInProgress ? 'app.submitting' : 'app.submit'}`)}
                {isSubmitInProgress && <FaSpinner className='spinner ml-3 inline' data-testid='submit-spinner' />}
              </button>
              <button
                type='button'
                onClick={() => {
                  onCancel()
                  setIsInEditMode(false)
                }}
                className='cancel-button'
                disabled={isSubmitInProgress}
                data-testid='cancel-button'
              >
                {format('app.cancel')}
              </button>
            </div>
          </div>
        ) : displayModeBody
      }
    </div>
  )
}

export default EditableSection
