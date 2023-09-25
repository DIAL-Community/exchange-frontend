import { Octokit } from '@octokit/core'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { MdRefresh } from 'react-icons/md'
import { useIntl } from 'react-intl'
import Select from '../form/Select'
import { DEFAULT_BRANCH_NAME } from './common'
import { EditorContext, EditorContextDispatch } from './EditorContext'

const BranchSelection = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { contentRepository, repositoryOwner, branchOptions, currentBranch } = useContext(EditorContext)
  const { setBranchOptions, setCurrentBranch } = useContext(EditorContextDispatch)

  const octokit = useMemo(() => new Octokit({ auth: process.env.NEXT_PUBLIC_REPO_TOKEN }), [])

  const updateBranchOptions = useCallback(async (branchName = DEFAULT_BRANCH_NAME) => {
    if (contentRepository && repositoryOwner) {
      const branchList = await octokit.request('GET /repos/{owner}/{repo}/branches', {
        owner: repositoryOwner,
        repo: contentRepository
      })

      // Loop over the branches and get their names. Populate in a dropdown so user can select version
      const branches = branchList.data.map(branch => ({ value: branch.name, label: branch.name }))
      const [firstBranch] = branches
      const [selectedBranch] = branches.filter(branch => branch.value === branchName)

      setBranchOptions(branches)
      setCurrentBranch(branchName && selectedBranch ? selectedBranch : firstBranch)
    }
  }, [contentRepository, repositoryOwner, octokit, setBranchOptions, setCurrentBranch])

  useEffect(() => {
    updateBranchOptions()
  }, [updateBranchOptions])

  return (
    <label>
      <div className='sr-only'>{format('govstack.api.branch')}</div>
      <div className='w-full flex gap-1'>
        <Select
          name='branch-options'
          className='w-full'
          options={branchOptions}
          onChange={(selectedBranch) => setCurrentBranch(selectedBranch)}
          value={currentBranch}
        />
        <MdRefresh
          onClick={() => updateBranchOptions()}
          className='inline text-2xl my-auto fill-dial-sapphire cursor-pointer'
        />
      </div>
    </label>
  )
}

export default BranchSelection
