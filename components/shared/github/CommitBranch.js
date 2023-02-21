import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import Input from '../../shared/Input'
import { DEFAULT_BRANCH_NAME } from './common'
import { EditorContext, EditorContextDispatch } from './EditorContext'

const CommitBranch = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { commitBranch, currentBranch } = useContext(EditorContext)
  const { setCommitBranch } = useContext(EditorContextDispatch)

  useEffect(() => {
    if (currentBranch) {
      setCommitBranch(currentBranch.value !== DEFAULT_BRANCH_NAME ? currentBranch.value : '')
    }
  }, [currentBranch, setCommitBranch])

  return (
    <div className='form-field-wrapper'>
      <label className='form-field-label text-base' htmlFor='branch'>
        {format('github.commit.branch')}
      </label>
      <Input
        className='text-sm'
        id='branch'
        value={commitBranch}
        onChange={(event) => setCommitBranch(event.target.value)}
        placeholder={DEFAULT_BRANCH_NAME}
      />
    </div>
  )
}

export default CommitBranch
