import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/Breadcrumb'
import ProjectForm from './fragments/ProjectForm'
import ProjectSimpleLeft from './fragments/ProjectSimpleLeft'

const ProjectCreate = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slugNameMapping = (() => {
    const map = {
      create: format('app.create')
    }

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <ProjectSimpleLeft />
        </div>
        <div className='lg:basis-2/3'>
          <ProjectForm />
        </div>
      </div>
    </div>
  )
}

export default ProjectCreate
