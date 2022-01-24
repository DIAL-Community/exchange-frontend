import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import UseCaseCard from '../use-cases/UseCaseCard'
import ReactHtmlParser from 'react-html-parser'

const WorkflowDetailRight = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
        {workflow.workflowDescription && ReactHtmlParser(workflow.workflowDescription.description)}
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
      {
        workflow.buildingBlocks && workflow.buildingBlocks.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('building-block.header')}</div>
            <div className='grid grid-cols-1'>
              {workflow.buildingBlocks.map((buildingBlock, i) => <BuildingBlockCard key={i} buildingBlock={buildingBlock} listType='list' />)}
            </div>
          </div>
      }
    </div>
  )
}

export default WorkflowDetailRight
