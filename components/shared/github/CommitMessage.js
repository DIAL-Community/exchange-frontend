import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import Input from '../../shared/Input'
import { EditorContext, EditorContextDispatch } from './EditorContext'

const CommitMesage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { commitMessage } = useContext(EditorContext)
  const { setCommitMessage } = useContext(EditorContextDispatch)

  return (
    <div className='form-field-wrapper'>
      <label className='form-field-label text-base' htmlFor='message'>
        {format('github.commit.message')}
      </label>
      <Input
        id='message'
        value={commitMessage}
        onChange={(event) => setCommitMessage(event.target.value)}
        placeholder={format('github.commit.messagePlaceholder')}
      />
    </div>
  )

}

export default CommitMesage
