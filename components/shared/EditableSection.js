import { useCallback, useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import CreateButton from './form/CreateButton'
import EditButton from './form/EditButton'

const EditableSection = ({
  editingAllowed,
  canEdit,
  sectionHeader,
  sectionDisclaimer,
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
      <div className='flex flex-row gap-3'>
        {sectionHeader}
        <div className='flex gap-3 ml-auto'>
          {(canEdit || editingAllowed) && !isInEditMode &&
            <EditButton onClick={() => setIsInEditMode(true)} />
          }
          {createAction && (canEdit || editingAllowed) && !isInEditMode &&
            <CreateButton label={format('app.createNew')} onClick={createAction} />
          }
        </div>
      </div>
      {sectionDisclaimer}
      {isInEditMode
        ? (
          <div className='bg-edit'>
            {editModeBody}
            <div className='px-4 lg:px-6 py-4 flex justify-end gap-3'>
              <button
                type='submit'
                onClick={() => {
                  setIsSubmitInProgress(true)
                  onSubmit()
                }}
                className='submit-button'
                disabled={!isDirty || isSubmitInProgress}
              >
                {format(`${isSubmitInProgress ? 'app.submitting' : 'app.submit'}`)}
                {isSubmitInProgress && <FaSpinner className='spinner ml-3 inline' />}
              </button>
              <button
                type='button'
                onClick={() => {
                  onCancel()
                  setIsInEditMode(false)
                }}
                className='cancel-button'
                disabled={isSubmitInProgress}
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
