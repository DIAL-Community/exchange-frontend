import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import 'swagger-ui-react/swagger-ui.css'
import { Octokit } from '@octokit/core'
import EditButton from '../shared/EditButton'
import { BUILDING_BLOCK_YAML_KEYS, DEFAULT_BRANCH_NAME, DEFAULT_REPO_OWNER } from './common'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

const ApiViewer = ({ repoName }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const [url, setUrl] = useState()

  const octokit = useMemo(() => new Octokit({ auth: process.env.NEXT_PUBLIC_UCMD_REPO_TOKEN }), [])

  const fetchDefinitionData = useCallback(async () => {
    if (repoName) {
      const [yamlData] = BUILDING_BLOCK_YAML_KEYS.filter(({ label }) => label === repoName)
      const requestString = 'GET /repos/{owner}/{repo}/contents/{path}'
      const requestParams = {
        owner: DEFAULT_REPO_OWNER,
        repo: repoName,
        path: yamlData.value,
        ref: DEFAULT_BRANCH_NAME
      }
      try {
        const { data: { download_url } } = await octokit.request(requestString, requestParams)
        setUrl(download_url)
      } catch (e) {
        setUrl('')
      }
    }
  }, [repoName, octokit])

  useEffect(() => {
    if (repoName) {
      fetchDefinitionData(repoName)
    }
  }, [repoName, fetchDefinitionData])

  return (
    <div className='flex flex-col gap-3 my-4'>
      <div className='px-4 flex flex-col md:flex-row gap-3'>
        <div className='flex flex-row gap-2 w-full'>
          <Link href='/govstack/building-blocks'>
            <a className='opacity-50'>
              <div className='flex gap-2 my-auto'>
                <AiOutlineArrowLeft className='my-auto'/>
                <span className='my-auto font-semibold'>{format('app.back')}</span>
              </div>
            </a>
          </Link>
          <div className='ml-auto my-auto'>
            <EditButton type='link' href={`${repoName}/edit`} />
          </div>
        </div>
      </div>
      <SwaggerUI url={url} />
    </div>
  )
}

export default ApiViewer
