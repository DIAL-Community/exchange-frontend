import { createContext, useEffect, useState } from 'react'
import { DEFAULT_BRANCH_NAME } from '../../govstack/common'

const EditorContext = createContext()
const EditorContextDispatch = createContext()

/**
 * Context holding metadata for the current editor. This will wrap the elements of a complete github editor.
 * @component
 * @example
 * const repository = GovstackApi
 * const owner = nribeka
 * const path = 'CONTENT-DIRECT.md'
 * const userName = 'Some Git Name'
 * const userEmail = 'some-git@some-domain.com'
 * return (
 *   <EditorContextProvider { ...{ repository, owner, path, userName, userEmail } }>
 *    <EditorTimer />
 *    <BranchSelection />
 *    <TypeMarkdownEditor />
 *    <div className='flex flex-row'>
 *      <CancelButton />
 *      <SubmitButton />
 *    </div>
 *   </EditorContextProvider>
 * )
 */
const EditorContextProvider = ({ repository, owner, path, userName, userEmail, children }) => {

  const [content, setContent] = useState()
  const [downloadUrl, setDownloadUrl] = useState()
  const [commitBranch, setCommitBranch] = useState()
  const [commitMessage, setCommitMessage] = useState()
  const [committerName, setCommitterName] = useState()
  const [committerEmail, setCommitterEmail] = useState()

  const [contentPath, setContentPath] = useState(path)
  const [contentRepository, setContentRepository] = useState(repository)
  const [repositoryOwner, setRepositoryOwner] = useState(owner)

  const [isDirty, setIsDirty] = useState(false)
  const [isMutating, setIsMutating] = useState(false)

  const [branchHashes, setBranchHashes] = useState({})
  const [branchOptions, setBranchOptions] = useState([])
  const [branchTimestamps, setBranchTimestamps] = useState({})
  const [currentBranch, setCurrentBranch] = useState({ name: DEFAULT_BRANCH_NAME, label: DEFAULT_BRANCH_NAME })

  useEffect(() => {
    setContentPath(path)
    setContentRepository(repository)
    setRepositoryOwner(owner)
    setCommitterName(userName)
    setCommitterEmail(userEmail)
  }, [repository, owner, path, userName, userEmail])

  const editorContextValues = {
    content,
    downloadUrl,
    commitBranch,
    commitMessage,
    committerName,
    committerEmail,
    contentPath,
    contentRepository,
    repositoryOwner,
    isDirty,
    isMutating,
    branchHashes,
    branchOptions,
    branchTimestamps,
    currentBranch
  }

  const editorContextDispatchValues = {
    setContent,
    setDownloadUrl,
    setContentPath,
    setCommitBranch,
    setCommitMessage,
    setCommitterName,
    setCommitterEmail,
    setContentRepository,
    setRepositoryOwner,
    setIsDirty,
    setIsMutating,
    setBranchHashes,
    setBranchOptions,
    setBranchTimestamps,
    setCurrentBranch
  }

  return (
    <EditorContext.Provider value={editorContextValues}>
      <EditorContextDispatch.Provider value={editorContextDispatchValues}>
        {children}
      </EditorContextDispatch.Provider>
    </EditorContext.Provider>
  )
}

export { EditorContextProvider, EditorContextDispatch, EditorContext }
