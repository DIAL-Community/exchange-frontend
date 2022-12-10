import { Octokit } from '@octokit/core'
import MDEditor from '@uiw/react-md-editor'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { EditorContext, EditorContextDispatch } from './EditorContext'

const TypeMarkdownEditor = ({ allowEditing = false }) => {
  const { content, contentPath, contentRepository, repositoryOwner, currentBranch } = useContext(EditorContext)
  const { setContent, setIsDirty, setDownloadUrl, setBranchHashes } = useContext(EditorContextDispatch)

  const octokit = useMemo(() => new Octokit({ auth: process.env.NEXT_PUBLIC_REPO_TOKEN }), [])

  const fetchDefinitionData = useCallback(async () => {
    if (contentPath && contentRepository && repositoryOwner && currentBranch) {
      const requestString = 'GET /repos/{owner}/{repo}/contents/{path}'
      const requestParams = {
        owner: repositoryOwner,
        repo: contentRepository,
        path: contentPath,
        ref: currentBranch.value
      }
      try {
        const { data: { download_url, sha } } = await octokit.request(requestString, requestParams)
        setBranchHashes(branchSecureHashes => ({
          ...branchSecureHashes,
          ...{ [[`${currentBranch.value}`]]: sha }
        }))

        const downloadResponse = await fetch(download_url)
        setContent(await downloadResponse.text())
        setDownloadUrl(download_url)
      } catch (e) {
        setContent('')
        setDownloadUrl('')
      }
    }
  }, [
    contentPath,
    contentRepository,
    repositoryOwner,
    currentBranch,
    octokit,
    setBranchHashes,
    setContent,
    setDownloadUrl
  ])

  useEffect(() => {
    fetchDefinitionData()
  }, [fetchDefinitionData])

  const onChangeHandler = (content) => {
    setContent(content)
    setIsDirty(true)
  }

  return (
    <>
      {allowEditing &&
        <div data-color-mode="light">
          <MDEditor
            height={500}
            value={content}
            onChange={onChangeHandler}
          />
        </div>
      }
    </>
  )
}

export default TypeMarkdownEditor
