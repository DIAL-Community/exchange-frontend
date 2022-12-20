import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useCallback, useContext, useEffect } from 'react'
import SubmitButton from '../shared/github/SubmitButton'
import CancelButton from '../shared/github/CancelButton'
import TypeYamlEditor from '../shared/github/TypeYamlEditor'
import BranchSelection from '../shared/github/BranchSelection'
import EditorTimer from '../shared/github/EditorTimer'
import { EditorContext, EditorContextDispatch } from '../shared/github/EditorContext'
import { MetadataContext } from './MetadataContext'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

const ApiEditor = ({ repositoryName }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { downloadUrl } = useContext(EditorContext)
  const { setContentPath, setContentRepository } = useContext(EditorContextDispatch)

  const { apiMetadata } = useContext(MetadataContext)

  useEffect(() => {
    setContentRepository(repositoryName)
    if (apiMetadata) {
      const [apiMetadataKey] = Object.keys(apiMetadata['api-mappings']).filter(key => {
        const apiMapping = apiMetadata['api-mappings'][key]

        return apiMapping.label === repositoryName
      })
      if (apiMetadataKey) {
        setContentPath(apiMetadata['api-mappings'][apiMetadataKey].value)
      }
    }
  }, [apiMetadata, repositoryName, setContentPath, setContentRepository])

  const onCancel = () => {
    router.push(`/govstack/building-blocks/${repositoryName}`)
  }

  return (
    <div className='flex flex-col gap-6 mx-3'>
      <div className='ml-auto w-full md:w-1/2 xl:w-1/3 flex flex-col mt-3'>
        <div className='w-full'>
          <EditorTimer />
        </div>
        <div className='w-full'>
          <BranchSelection />
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='py-3 text-xl'>{format('govstack.api.editorTitle')}</div>
        <div className='flex flex-col md:flex-row gap-3'>
          <div className='w-full md:w-1/2'>
            <TypeYamlEditor />
          </div>
          <div className='w-full md:w-1/2 border rounded' style={{ maxHeight: '60vh', overflow: 'auto' }}>
            <SwaggerUI url={downloadUrl} />
          </div>
        </div>
      </div>
      <div className='ml-auto flex gap-3 text-xl'>
        <SubmitButton />
        <CancelButton onCancel={onCancel} />
      </div>
    </div>
  )
}

export default ApiEditor
