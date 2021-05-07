import { FormattedDate, useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import WorkflowCard from '../workflows/WorkflowCard'
import ReactHtmlParser from 'react-html-parser'

const UseCaseDetailRight = ({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const workflows = (() => {
    if (!useCase.useCaseSteps) {
      return
    }

    const workflows = []
    useCase.useCaseSteps.map(useCaseStep => {
      useCaseStep.workflows.map(workflow => {
        const workflowSlugs = workflows.map(u => u.slug)
        if (workflowSlugs.indexOf(workflow.slug) === -1) {
          workflows.push(workflow)
        }
        return workflow
      })
      return useCaseStep
    })
    return workflows
  })()

  return (
    <div className=''>
      <Breadcrumb />
      <div className='fr-view'>
        {useCase.useCaseDescriptions[0] && ReactHtmlParser(useCase.useCaseDescriptions[0].description)}
      </div>
      {
        workflows && workflows.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3'>{format('workflow.header')}</div>
            <div className='grid grid-cols-1'>
              {workflows.map((workflow, i) => <WorkflowCard key={i} workflow={workflow} listType='list' />)}
            </div>
          </div>
      }
    </div>
  )
}

export default UseCaseDetailRight
