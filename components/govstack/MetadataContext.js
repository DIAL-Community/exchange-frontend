import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { load } from 'js-yaml'
import { Octokit } from '@octokit/core'
import { DEFAULT_BRANCH_NAME, DEFAULT_METADATA_REPOSITORY, DEFAULT_REPO_OWNER } from './common'

const MetadataContext = createContext()

const MetadataContextProvider = ({ children }) => {
  const [apiMetadata, setApiMetadata] = useState()

  const octokit = useMemo(() => new Octokit({ auth: process.env.NEXT_PUBLIC_REPO_TOKEN }), [])

  const yamlPath = 'api-metadata.yml'
  const fetchDefinitionData = useCallback(async () => {
    const requestString = 'GET /repos/{owner}/{repo}/contents/{path}'
    const requestParams = {
      owner: DEFAULT_REPO_OWNER,
      repo: DEFAULT_METADATA_REPOSITORY,
      path: yamlPath,
      ref: DEFAULT_BRANCH_NAME
    }
    try {
      const { data: { download_url } } = await octokit.request(requestString, requestParams)
      const downloadResponse = await fetch(download_url)
      setApiMetadata(load(await downloadResponse.text()))
    } catch (e) {
      setApiMetadata()
    }
  }, [yamlPath, octokit, setApiMetadata])

  useEffect(() => {
    fetchDefinitionData()
  }, [fetchDefinitionData])

  return (
    <MetadataContext.Provider value={{ apiMetadata, setApiMetadata }}>
      {children}
    </MetadataContext.Provider>
  )
}

export { MetadataContextProvider, MetadataContext }
