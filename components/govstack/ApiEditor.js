import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useMemo, useContext } from 'react'
import { MdRefresh } from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'
import Editor from 'react-simple-code-editor'
import { Octokit } from '@octokit/core'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-yaml'
import 'swagger-ui-react/swagger-ui.css'
import Select from '../shared/Select'
import { ToastContext } from '../../lib/ToastContext'
import { BUILDING_BLOCK_YAML_KEYS, DEFAULT_BRANCH_NAME, DEFAULT_REPO_OWNER, prependPadding } from './common'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

const ApiEditor = ({ repoName }) => {
  const [url, setUrl] = useState()
  const [code, setCode] = useState('')

  const [isDirty, setIsDirty] = useState(false)
  const [mutating, setMutating] = useState(false)

  const router = useRouter()

  const { showToast } = useContext(ToastContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [branchSecureHashes, setBranchSecureHashes] = useState({})
  const [branchOptions, setBranchOptions] = useState([])
  const [currentBranch, setCurrentBranch] = useState()

  const [branchUpdateDates, setBranchUpdateDates] = useState({})
  const [timeElapsed, setTimeElapsed] = useState({})

  const octokit = useMemo(() => new Octokit({ auth: process.env.NEXT_PUBLIC_UCMD_REPO_TOKEN }), [])

  const fetchDefinitionData = useCallback(async () => {
    if (repoName) {
      const [yamlData] = BUILDING_BLOCK_YAML_KEYS.filter(({ label }) => label === repoName)
      const requestString = 'GET /repos/{owner}/{repo}/contents/{path}'
      const requestParams = {
        owner: DEFAULT_REPO_OWNER,
        repo: repoName,
        path: yamlData.value,
        ref: currentBranch.value
      }
      try {
        const { data: { download_url, sha } } = await octokit.request(requestString, requestParams)
        setBranchSecureHashes(branchSecureHashes => ({
          ...branchSecureHashes,
          ...{ [[`${currentBranch.value}`]]: sha }
        }))

        const downloadResponse = await fetch(download_url)
        setUrl(download_url)
        setCode(await downloadResponse.text())
      } catch (e) {
        setUrl('')
        setCode('')
      }
    }
  }, [repoName, currentBranch, octokit])

  const fetchLastCommitData = useCallback(async () => {
    if (repoName) {
      const [yamlData] = BUILDING_BLOCK_YAML_KEYS.filter(({ label }) => label === repoName)
      const requestString = 'GET /repos/{owner}/{repo}/commits'
      const requestParams = {
        owner: DEFAULT_REPO_OWNER,
        repo: repoName,
        path: yamlData.value,
        sha: currentBranch.value,
        page: 1,
        per_page: 1
      }
      const { data: [latestCommit] } = await octokit.request(requestString, requestParams)
      if (latestCommit) {
        const { commit } = latestCommit

        setBranchUpdateDates(branchUpdateDates => ({
          ...branchUpdateDates,
          ...{ [[`${currentBranch.value}`]]: Date.parse(commit?.committer?.date) }
        }))
      }
    }
  }, [repoName, currentBranch, octokit])

  const updateBranchOptions = useCallback(async (branchName = 'main') => {
    if (repoName) {
      const branchList = await octokit.request('GET /repos/{owner}/{repo}/branches', {
        owner: DEFAULT_REPO_OWNER,
        repo: repoName
      })

      // Loop over the branches and get their names. Populate in a dropdown so user can select version
      const branches = branchList.data.map(branch => ({ value: branch.name, label: branch.name }))
      const [firstBranch] = branches
      const [selectedBranch] = branches.filter(branch => branch.value === branchName)

      setBranchOptions(branches)
      setCurrentBranch(branchName && selectedBranch ? selectedBranch : firstBranch)
    }
  }, [repoName, octokit])

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
      fetchDefinitionData(currentBranch)
      fetchLastCommitData(currentBranch)
    }
  }, [currentBranch, fetchDefinitionData, fetchLastCommitData])

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
          owner: DEFAULT_REPO_OWNER,
          repo: repoName,
          branch: DEFAULT_BRANCH_NAME
        })

        // Setup branch name.
        const d = new Date()
        const branchDate = `${d.getFullYear()}${prependPadding(d.getMonth() + 1, 2)}${prependPadding(d.getDate(), 2)}`
        const branchTime = `${prependPadding(d.getHours(), 2)}${prependPadding(d.getMinutes(), 2)}`
        branchName = `gs-${repoName}-${branchDate}-${branchTime}`
        // Create a new branch (ref)
        await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
          owner: DEFAULT_REPO_OWNER,
          repo: repoName,
          ref: `refs/heads/${branchName}`,
          sha: commit?.sha,
          force: true
        })

        setBranchOptions([...branchOptions, { value: branchName, label: branchName }])
        setCurrentBranch({ value: branchName, label: branchName })
      }

      const [yamlData] = BUILDING_BLOCK_YAML_KEYS.filter(({ label }) => label === repoName)
      // Commit the changes to the branch
      const { data: { commit, content } } = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: DEFAULT_REPO_OWNER,
        repo: repoName,
        path: yamlData.value,
        message: 'Updates building blocks specification.',
        committer: {
          name: 'Nyoman Ribeka',
          email: 'nyoman.ribeka@gmail.com'
        },
        content: Buffer.from(code).toString('base64'),
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
        owner: DEFAULT_REPO_OWNER,
        repo: repoName,
        base: DEFAULT_BRANCH_NAME,
        head: `${process.env.NEXT_PUBLIC_UCMD_REPO_OWNER}:${branchName}`,
        page: 1,
        per_page: 1
      })

      if (!firstPullRequest) {
        await octokit.request('POST /repos/{owner}/{repo}/pulls', {
          owner: DEFAULT_REPO_OWNER,
          repo: repoName,
          head: `${DEFAULT_REPO_OWNER}:${branchName}`,
          base: DEFAULT_BRANCH_NAME,
          title: `Updated Specification in ${branchName}.`
        })
      }

      showToast(
        format('toast.edit.submit.success'),
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
        format('toast.edit.submit.failure'),
        'error',
        'top-center'
      )
    } finally {
      setMutating(false)
    }
  }

  const onChangeHandler = (code) => {
    setCode(code)
    setIsDirty(true)
  }

  const onCancel = () => {
    router.push(`/govstack/building-blocks/${repoName}`)
  }

  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false)

  useEffect(() => {
    if (isSubmitInProgress && !mutating) {
      setIsSubmitInProgress(false)
    }
  }, [isSubmitInProgress, mutating])

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
        `.trim()
      }
    )
    : format('app.lastUpdated', { lastUpdated: format('general.na') })

  return (
    <div className='flex flex-col gap-6 mx-3'>
      <div className='ml-auto w-full md:w-1/2 xl:w-1/3 flex flex-col mt-3'>
        <div className='w-full'>
          <div
            className={
              `my-1 text-xs
              ${timeElapsed.days > 0 || timeElapsed.hours > 0 ||
                (timeElapsed.minutes >= 5 && timeElapsed.seconds >= 0)
                ? 'text-green-500'
                : 'text-rose-500'}`
            }
          >
            {lastUpdatedBody}
          </div>
        </div>
        <div className='w-full'>
          <label>
            <div className='sr-only'>{format('govstack.api.branch')}</div>
            <div className='w-full flex gap-1'>
              <Select
                className='w-full'
                options={branchOptions}
                onChange={(selectedBranch) => setCurrentBranch(selectedBranch)}
                value={currentBranch}
              />
              <MdRefresh
                onClick={() => updateBranchOptions()}
                className='inline text-3xl my-auto fill-dial-blue cursor-pointer'
              />
            </div>
          </label>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='py-3 text-xl'>{format('govstack.api.editorTitle')}</div>
        <div className='flex flex-col md:flex-row gap-3'>
          <div className='w-full md:w-1/2'>
            <div className='api-editor border rounded' style={{ maxHeight: '60vh', overflow: 'auto' }}>
              <Editor
                value={code}
                className='bg-edit'
                onValueChange={onChangeHandler}
                highlight={(code) => highlight(code, languages.yaml, 'yaml')}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  minHeight: '100%',
                  maxHeight: '100%',
                  fontSize: 12,
                }}
              />
            </div>
          </div>
          <div className='w-full md:w-1/2 border rounded' style={{ maxHeight: '60vh', overflow: 'auto' }}>
            <SwaggerUI url={url} />
          </div>
        </div>
      </div>
      <div className='ml-auto flex gap-3 text-xl'>
        <button
          type='submit'
          onClick={() => {
            setIsSubmitInProgress(true)
            submitChanges()
          }}
          className='submit-button'
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
          }}
          className='cancel-button'
          disabled={isSubmitInProgress}
          data-testid='cancel-button'
        >
          {format('app.cancel')}
        </button>
      </div>
    </div>
  )
}

export default ApiEditor
