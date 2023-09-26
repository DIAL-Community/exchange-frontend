import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useCallback, useContext, useEffect } from 'react'
import 'swagger-ui-react/swagger-ui.css'
import EditButton from '../shared/form/EditButton'
import { EditorContext, EditorContextDispatch } from '../shared/github/EditorContext'
import TypeYamlEditor from '../shared/github/TypeYamlEditor'
import { MetadataContext } from './MetadataContext'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

const ApiViewer = ({ repositoryName }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

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

  return (
    <div className='flex flex-col gap-3 my-4'>
      <div className='px-4 flex flex-col md:flex-row gap-3'>
        <div className='flex flex-row gap-2 w-full'>
          <Link href='/govstack/building-blocks' className='opacity-50'>
            <div className='flex gap-2 my-auto'>
              <AiOutlineArrowLeft className='my-auto'/>
              <span className='my-auto font-semibold'>{format('app.back')}</span>
            </div>
          </Link>
          <div className='ml-auto my-auto'>
            <EditButton type='link' href={`${repositoryName}/edit`} />
          </div>
        </div>
      </div>
      <TypeYamlEditor allowEditing={false} />
      <SwaggerUI url={downloadUrl} />
    </div>
  )
}

export default ApiViewer
