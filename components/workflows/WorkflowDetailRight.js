import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import Breadcrumb from '../shared/breadcrumb'
import UseCaseCard from '../use-cases/UseCaseCard'
import WorkflowDetailBuildingBlocks from './WorkflowDetailBuildingBlocks'

const WorkflowDetailRight = ({ workflow, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const useCases = (() => {
    if (!workflow.useCaseSteps) {
      return
    }

    const useCases = []
    workflow.useCaseSteps.map(useCaseStep => {
      const useCaseSlugs = useCases.map(u => u.slug)
      if (useCaseSlugs.indexOf(useCaseStep.useCase.slug) === -1) {
        useCases.push(useCaseStep.useCase)
      }

      return useCaseStep
    })

    return useCases
  })()

  const slugNameMapping = (() => {
    const map = {}
    map[workflow.slug] = workflow.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='fr-view text-dial-gray-dark'>
        {workflow.workflowDescription && parse(workflow.workflowDescription.description)}
      </div>
      {
        useCases && useCases.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('useCase.header')}</div>
            <div className='grid grid-cols-1'>
              {useCases.map((useCase, i) => <UseCaseCard key={i} useCase={useCase} listType='list' />)}
            </div>
          </div>
      }
      {workflow.buildingBlocks && <WorkflowDetailBuildingBlocks workflow={workflow} canEdit={canEdit} />}
    </div>
  )
}

export default WorkflowDetailRight
