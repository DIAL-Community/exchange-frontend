import { Octokit } from '@octokit/core'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-yaml'
import 'swagger-ui-react/swagger-ui.css'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import Editor from 'react-simple-code-editor'
import { EditorContext, EditorContextDispatch } from './EditorContext'

const TypeYamlEditor = ({ allowEditing = true, maxHeight = '60vh' }) => {
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
        <div className='api-editor border rounded' style={{ maxHeight, overflow: 'auto' }}>
          <Editor
            value={content}
            className='bg-edit'
            onValueChange={onChangeHandler}
            highlight={(content) => highlight(content ?? '', languages.yaml, 'yaml')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              minHeight: '100%',
              maxHeight: '100%',
              fontSize: 12,
            }}
          />
        </div>
      }
    </>
  )
}

export default TypeYamlEditor
