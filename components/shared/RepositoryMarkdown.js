import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useMemo, useContext } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { Octokit } from '@octokit/core'
import { MdRefresh } from 'react-icons/md'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import Select from './Select'
import EditableSection from './EditableSection'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

const Markdown = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
)

// Prepend zero to date parts. Converting '2' to '02' for consistent branch name length.
const prependPading = (number, size) => {
  number = number.toString()
  while (number.length < size) {
    number = `0${number}`
  }

  return number
}

// Using main entity id for the branch name because editing is on the main entity context.
const fetchEntityId = (entity) => {
  if (entity.id) {
    if (entity.useCase.id) {
      return entity.useCase.id
    }
  }

  return 'NA'
}

const RepositoryMarkdown = ({ entityWithMarkdown, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [markdown, setMarkdown] = useState()
  const [branchSecureHashes, setBranchSecureHashes] = useState({})
  const [branchOptions, setBranchOptions] = useState([])
  const [currentBranch, setCurrentBranch] = useState()

  const { user } = useUser()

  const [isDirty, setIsDirty] = useState(false)
  const [mutating, setMutating] = useState(false)

  const [branchUpdateDates, setBranchUpdateDates] = useState({})
  const [timeElapsed, setTimeElapsed] = useState({})

  const { showToast } = useContext(ToastContext)

  const markdownUrl = entityWithMarkdown.markdownUrl
  const octokit = useMemo(() => new Octokit({ auth: process.env.NEXT_PUBLIC_UCMD_REPO_TOKEN }), [])

  const fetchMarkdownData = useCallback(async (currentBranch) => {
    const requestString = 'GET /repos/{owner}/{repo}/contents/{path}'
    const requestParams = {
      owner: process.env.NEXT_PUBLIC_UCMD_REPO_OWNER,
      repo: process.env.NEXT_PUBLIC_UCMD_REPO_NAME,
      path: markdownUrl,
      ref: currentBranch.value
    }
    try {
      const { data: { download_url, sha } } = await octokit.request(requestString, requestParams)
      setBranchSecureHashes(branchSecureHashes => ({
        ...branchSecureHashes,
        ...{ [[`${currentBranch.value}`]]: sha }
      }))

      const downloadResponse = await fetch(download_url)
      setMarkdown(await downloadResponse.text())
    } catch (e) {
      setMarkdown('')
    }
  }, [markdownUrl, octokit])

  const fetchLastCommitData = useCallback(async (currentBranch) => {
    const requestString = 'GET /repos/{owner}/{repo}/commits'
    const requestParams = {
      owner: process.env.NEXT_PUBLIC_UCMD_REPO_OWNER,
      repo: process.env.NEXT_PUBLIC_UCMD_REPO_NAME,
      path: markdownUrl,
      sha: currentBranch.value,
      page: 1,
      per_page: 1
    }
    const { data: [latestCommit] } = await octokit.request(requestString, requestParams)
    if (latestCommit) {
      const { commit } = latestCommit

      // TODO: Only perform update when:
      // * State doesn't have commit date for the branch.
      // * The commit date is later compared what is recorded in the state already (new commit)
      // This will still not solve the following scenario:
      // - User edit the use case markdown and commit the changes (with or without creating PR)
      // - User browse to other pages
      // - User come back to the use case edit page less than 5 minutes later.
      // - User potentially will not see their changes / branch because Github API cached data.

      setBranchUpdateDates(branchUpdateDates => ({
        ...branchUpdateDates,
        ...{ [[`${currentBranch.value}`]]: Date.parse(commit?.committer?.date) } })
      )
    }
  }, [markdownUrl, octokit])

  const updateBranchOptions = useCallback(async(branchName) => {
    const branchList = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: process.env.NEXT_PUBLIC_UCMD_REPO_OWNER,
      repo: process.env.NEXT_PUBLIC_UCMD_REPO_NAME
    })

    // Loop over the branches and get their names. Populate in a dropdown so user can select version
    const branches = branchList.data.map(branch => ({ value: branch.name, label: branch.name }))
    const [firstBranch] = branches
    const [selectedBranch] = branches.filter(branch => branch.value === branchName)

    setBranchOptions(branches)
    setCurrentBranch(branchName && selectedBranch ? selectedBranch : firstBranch)
  }, [octokit])

  useEffect(() => {
    const calculateTimeLeft = () => {
      let timeElapsed = {}
      if (currentBranch) {
        const difference = new Date() - branchUpdateDates[currentBranch.value]
        if (difference > 0) {
          timeElapsed = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          }
        }
      }

      return timeElapsed
    }

    const id = setTimeout(() => {
      setTimeElapsed(calculateTimeLeft())
    }, 1000)

    return () => {
      clearTimeout(id)
    }
  })

  useEffect(() => {
    if (currentBranch) {
      fetchMarkdownData(currentBranch)
      fetchLastCommitData(currentBranch)
    }
  }, [currentBranch, fetchMarkdownData, fetchLastCommitData])

  useEffect(() => {
    updateBranchOptions()
  }, [updateBranchOptions])

  const submitChanges = async () => {
    setMutating(true)
    try {
      let branchName = currentBranch.value
      // Only create new branch if current branch is main.
      if (branchName === process.env.NEXT_PUBLIC_UCMD_REPO_MAIN_BRANCH) {
        // Get main branch and pull the sha from that
        const { data: { commit } } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
          owner: process.env.NEXT_PUBLIC_UCMD_REPO_OWNER,
          repo: process.env.NEXT_PUBLIC_UCMD_REPO_NAME,
          branch: process.env.NEXT_PUBLIC_UCMD_REPO_MAIN_BRANCH
        })

        // Setup branch name.
        const d = new Date()
        const branchDate = `${d.getFullYear()}${prependPading(d.getMonth() + 1, 2)}${prependPading(d.getDate(), 2)}`
        const branchTime = `${prependPading(d.getHours(), 2)}${prependPading(d.getMinutes(), 2)}`
        branchName = `rmd-${fetchEntityId(entityWithMarkdown)}-${branchDate}-${branchTime}`
        // Create a new branch (ref)
        await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
          owner: process.env.NEXT_PUBLIC_UCMD_REPO_OWNER,
          repo: process.env.NEXT_PUBLIC_UCMD_REPO_NAME,
          ref: `refs/heads/${branchName}`,
          sha: commit?.sha,
          force: true
        })

        setBranchOptions([...branchOptions, { value: branchName, label: branchName }])
        setCurrentBranch({ value: branchName, label: branchName })
      }

      // Commit the changes to the branch
      const { data: { commit, content } } = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: process.env.NEXT_PUBLIC_UCMD_REPO_OWNER,
        repo: process.env.NEXT_PUBLIC_UCMD_REPO_NAME,
        path: markdownUrl,
        message: 'Updates markdown specification.',
        committer: {
          name: user.userName,
          email: user.userEmail
        },
        content: Buffer.from(markdown).toString('base64'),
        sha: branchSecureHashes[branchName] ?? branchSecureHashes[process.env.NEXT_PUBLIC_UCMD_REPO_MAIN_BRANCH],
        branch: branchName
      })

      const { sha } = content
      setBranchSecureHashes(branchSecureHashes => ({
        ...branchSecureHashes,
        ...{ [[`${branchName}`]]: sha }
      }))

      // Check if we have pull request from the branch.
      const { data: [firstPullRequest] } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: process.env.NEXT_PUBLIC_UCMD_REPO_OWNER,
        repo: process.env.NEXT_PUBLIC_UCMD_REPO_NAME,
        base: process.env.NEXT_PUBLIC_UCMD_REPO_MAIN_BRANCH,
        head: `${process.env.NEXT_PUBLIC_UCMD_REPO_OWNER}:${branchName}`,
        page: 1,
        per_page: 1
      })

      if (!firstPullRequest) {
        await octokit.request('POST /repos/{owner}/{repo}/pulls', {
          owner: process.env.NEXT_PUBLIC_UCMD_REPO_OWNER,
          repo: process.env.NEXT_PUBLIC_UCMD_REPO_NAME,
          head: `${process.env.NEXT_PUBLIC_UCMD_REPO_OWNER}:${branchName}`,
          base: process.env.NEXT_PUBLIC_UCMD_REPO_MAIN_BRANCH,
          title: `Updated Specification in ${branchName}.`
        })
      }

      showToast(
        format('toast.markdown.submit.success'),
        'success',
        'top-center',
        null,
        null,
        () => {
          setBranchUpdateDates(branchUpdateDates => ({
            ...branchUpdateDates,
            ...{ [[`${branchName}`]]: Date.parse(commit?.committer?.date) }
          }))
        }
      )
    } catch (e) {
      showToast(
        format('toast.markdown.submit.failure'),
        'error',
        'top-center'
      )
    } finally {
      setMutating(false)
    }
  }

  const onChangeHandler = (markdown) => {
    setMarkdown(markdown)
    setIsDirty(true)
  }

  const onCancel = () => {
    setMutating(false)
    setIsDirty(false)
  }

  const lastUpdatedBody = currentBranch && branchUpdateDates[currentBranch.value]
    ? format(
      'app.lastUpdated',
      {
        lastUpdated: `
          ${timeElapsed.days ? timeElapsed.days + 'd' : ''}
          ${timeElapsed.hours ? timeElapsed.hours + 'h' : ''}
          ${timeElapsed.minutes ? timeElapsed.minutes + 'm' : ''}
          ${timeElapsed.seconds ? timeElapsed.seconds + 's' : ''}
          ${format('general.pastSuffix')}
        `
      }
    )
    : format('app.lastUpdated', { lastUpdated: format('general.na') })

  const displayModeBody =
    <div data-color-mode="light">
      <Markdown source={markdown} />
    </div>

  const editModeBody =
    <div className='flex flex-col gap-3'>
      <div className='flex gap-3'>
        <Select className='w-1/4'
          options={branchOptions}
          onChange={(selectedBranch) => setCurrentBranch(selectedBranch)}
          value={currentBranch}
        />
        <MdRefresh
          onClick={() => updateBranchOptions()}
          className='text-2xl my-auto fill-dial-sapphire cursor-pointer'
        />
        <div
          className={`
            ml-auto my-auto text-xs
            ${timeElapsed.days > 0 || timeElapsed.hours > 0 ||
              (timeElapsed.minutes >= 5 && timeElapsed.seconds >= 0)
            ? 'text-green-500'
            : 'text-rose-500'}
          `}
        >
          {lastUpdatedBody}
        </div>
      </div>
      <div data-color-mode="light">
        <MDEditor
          height={500}
          value={markdown}
          onChange={onChangeHandler}
        />
      </div>
    </div>

  return (
    <div className='-mt-12'>
      <EditableSection
        canEdit={canEdit}
        onSubmit={submitChanges}
        onCancel={onCancel}
        isDirty={isDirty}
        isMutating={mutating}
        displayModeBody={displayModeBody}
        editModeBody={editModeBody}
      />
    </div>
  )
}

export default RepositoryMarkdown
