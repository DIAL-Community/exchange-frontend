import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import BranchSelection from '../shared/github/BranchSelection'
import CancelButton from '../shared/github/CancelButton'
import EditorTimer from '../shared/github/EditorTimer'
import TypeYamlEditor from '../shared/github/TypeYamlEditor'
import SubmitButton from '../shared/github/SubmitButton'

const MetadataEditor = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const onCancel = () => {
    router.push('/govstack/building-blocks')
  }

  return (
    <div className='flex flex-col gap-6 mx-3'>
      <div className='ml-auto w-full md:w-1/2 xl:w-1/3 flex flex-col mt-3'>
        <div className='w-full mb-1'>
          <EditorTimer />
        </div>
        <div className='w-full'>
          <label>
            <div className='sr-only'>{format('govstack.api.branch')}</div>
            <BranchSelection />
          </label>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='py-3 text-xl'>{format('govstack.api.editorTitle')}</div>
        <TypeYamlEditor />
      </div>
      <div className='ml-auto flex gap-3 text-xl'>
        <SubmitButton />
        <CancelButton onCancel={onCancel} />
      </div>
    </div>
  )
}

export default MetadataEditor
