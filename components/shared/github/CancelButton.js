import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { EditorContext } from './EditorContext'

const CancelButton = ({ onCancel }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { isMutating } = useContext(EditorContext)

  return (
    <button
      type='button'
      onClick={onCancel}
      className='cancel-button'
      disabled={isMutating}
    >
      {format('app.cancel')}
    </button>
  )
}

export default CancelButton
