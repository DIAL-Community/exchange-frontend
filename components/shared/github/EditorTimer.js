import { Octokit } from '@octokit/core'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { EditorContext, EditorContextDispatch } from './EditorContext'

const EditorTimer = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [timeElapsed, setTimeElapsed] = useState({})

  const { contentPath, contentRepository, repositoryOwner, currentBranch, branchTimestamps } = useContext(EditorContext)
  const { setBranchTimestamps } = useContext(EditorContextDispatch)

  const octokit = useMemo(() => new Octokit({ auth: process.env.NEXT_PUBLIC_REPO_TOKEN }), [])

  const fetchLastCommitData = useCallback(async () => {
    if (contentPath && contentRepository && repositoryOwner && currentBranch) {
      const requestString = 'GET /repos/{owner}/{repo}/commits'
      const requestParams = {
        owner: repositoryOwner,
        repo: contentRepository,
        path: contentPath,
        sha: currentBranch.value,
        page: 1,
        per_page: 1
      }
      const { data: [latestCommit] } = await octokit.request(requestString, requestParams)
      if (latestCommit) {
        const { commit } = latestCommit

        setBranchTimestamps(branchTimestamps => ({
          ...branchTimestamps,
          ...{ [[`${currentBranch.value}`]]: Date.parse(commit?.committer?.date) }
        }))
      }
    }
  }, [contentPath, contentRepository, repositoryOwner, currentBranch, octokit, setBranchTimestamps])

  useEffect(() => {
    fetchLastCommitData()
  }, [fetchLastCommitData])

  useEffect(() => {
    const calculateTimeLeft = () => {
      let timeElapsed = {}
      if (currentBranch) {
        const difference = new Date() - branchTimestamps[currentBranch.value]
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

  const lastUpdatedBody = currentBranch && branchTimestamps[currentBranch.value]
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
    <div
      className={
        `text-xs
          ${timeElapsed.days > 0 || timeElapsed.hours > 0 ||
          (timeElapsed.minutes >= 5 && timeElapsed.seconds >= 0)
          ? 'text-green-500'
          : 'text-rose-500'}`
      }
    >
      {lastUpdatedBody}
    </div>
  )

}

export default EditorTimer
