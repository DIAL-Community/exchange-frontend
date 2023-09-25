import { Octokit } from '@octokit/core'
import { useCallback, useContext, useMemo } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'
import { DEFAULT_BRANCH_NAME, prependPadding } from './common'
import { EditorContext, EditorContextDispatch } from './EditorContext'

const SubmitButton = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showToast } = useContext(ToastContext)

  const {
    isDirty,
    isMutating,
    content,
    commitMessage,
    committerName,
    committerEmail,
    contentPath,
    contentRepository,
    repositoryOwner,
    branchHashes,
    currentBranch,
    commitBranch
  } = useContext(EditorContext)

  const {
    setIsMutating,
    setCommitMessage,
    setBranchOptions,
    setBranchHashes,
    setCurrentBranch,
    setBranchTimestamps
  } = useContext(EditorContextDispatch)

  const octokit = useMemo(() => new Octokit({ auth: process.env.NEXT_PUBLIC_REPO_TOKEN }), [])

  const submitChanges = async () => {
    setIsMutating(true)
    try {
      let branchName = commitBranch
      if (!branchName || branchName === DEFAULT_BRANCH_NAME) {
        // Setup branch name if commitBranch is not supplied.
        const d = new Date()
        const branchDate = `${d.getFullYear()}${prependPadding(d.getMonth() + 1, 2)}${prependPadding(d.getDate(), 2)}`
        const branchTime = `${prependPadding(d.getHours(), 2)}${prependPadding(d.getMinutes(), 2)}`
        branchName = `gs-${contentRepository}-${branchDate}-${branchTime}`
      }

      const { data: [matchingRef] } = await octokit.request('GET /repos/{owner}/{repo}/git/matching-refs/{ref}', {
        owner: repositoryOwner,
        repo: contentRepository,
        ref: `heads/${branchName}`
      })

      if (!matchingRef && !branchHashes[branchName]) {
        const { data: { commit } } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
          owner: repositoryOwner,
          repo: contentRepository,
          branch: currentBranch.value
        })

        // Create a new branch (ref)
        await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
          owner: repositoryOwner,
          repo: contentRepository,
          ref: `refs/heads/${branchName}`,
          sha: commit?.sha,
          force: true
        })

        setBranchOptions((branchOptions) => [...branchOptions, { value: branchName, label: branchName }])
        setCurrentBranch({ value: branchName, label: branchName })
      }

      // Commit the changes to the branch
      const { data: { commit, content: { sha } } } = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: repositoryOwner,
        repo: contentRepository,
        path: contentPath,
        message: commitMessage ?? format('github.commit.defaultMessage', { path: contentPath }),
        committer: {
          // TODO: Need govstack user's name and email here.
          // We can use the catalog login information, but are they going to share login?
          // Catalog login information will come from useUser() hook.
          name: committerName,
          email: committerEmail
        },
        content: Buffer.from(content).toString('base64'),
        sha: branchHashes[branchName] ?? branchHashes[currentBranch.value],
        branch: branchName
      })

      // Check if we have pull request from the branch.
      const { data: [firstPullRequest] } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: repositoryOwner,
        repo: contentRepository,
        base: DEFAULT_BRANCH_NAME,
        head: `${repositoryOwner}:${branchName}`,
        page: 1,
        per_page: 1
      })

      if (!firstPullRequest && !branchHashes[branchName]) {
        await octokit.request('POST /repos/{owner}/{repo}/pulls', {
          owner: repositoryOwner,
          repo: contentRepository,
          head: `${repositoryOwner}:${branchName}`,
          base: DEFAULT_BRANCH_NAME,
          title: format('github.pr.defaultTitle', { branch: branchName })
        })
      }

      setBranchHashes((branchHashes) => ({
        ...branchHashes,
        ...{ [[`${branchName}`]]: sha }
      }))

      setBranchTimestamps((branchTimestamps) => ({
        ...branchTimestamps,
        ...{ [[`${branchName}`]]: Date.parse(commit?.committer?.date) }
      }))

      showToast(
        format('toast.edit.submit.success'),
        'success',
        'top-center'
      )
    } catch (e) {
      showToast(
        format('toast.edit.submit.failure'),
        'error',
        'top-center'
      )
    } finally {
      setCommitMessage()
      setIsMutating(false)
    }
  }

  return (
    <button
      type='submit'
      onClick={() => {
        setIsMutating(true)
        submitChanges()
      }}
      className='submit-button'
      disabled={!isDirty || isMutating}
      data-testid='submit-button'
    >
      {format(`${isMutating ? 'app.submitting' : 'app.submit'}`)}
      {isMutating && <FaSpinner className='spinner ml-3 inline' data-testid='submit-spinner' />}
    </button>
  )
}

export default SubmitButton
