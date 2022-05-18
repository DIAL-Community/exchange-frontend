import { useIntl } from 'react-intl'
import { useState, useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'
import EditButton from '../shared/EditButton'

const EditableSection = ({ canEdit, sectionHeader, editModeBody, displayModeBody, isDirty, isMutating, onSubmit, onCancel }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [isInEditMode, setIsInEditMode] = useState(false)

  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false)

  useEffect(() => {
    // if mutation has finished switch back to display mode
    if (isSubmitInProgress && !isMutating) {
      setIsInEditMode(false)
      setIsSubmitInProgress(false)
    }
  }, [isSubmitInProgress, isMutating])

  return (
    <div className='mt-12'>
      <div className='flex justify-between items-center mb-3'>
        <div className='card-title text-dial-gray-dark'>{sectionHeader}</div>
        {canEdit && !isInEditMode && <EditButton onClick={() => setIsInEditMode(true)} className='mr-2' />}
      </div>
      {isInEditMode
        ? (
          <div className='bg-edit p-6'>
            {editModeBody}
            <div className='flex justify-end mt-8 gap-3 text-xl'>
              <button
                type='submit'
                onClick={() => {
                  setIsSubmitInProgress(true)
                  onSubmit()
                }}
                className='flex items-center bg-dial-blue text-white py-2 px-5 rounded-md disabled:bg-dial-gray'
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
                className='bg-button-gray-light text-white py-2 px-5 rounded-md disabled:opacity-50'
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
