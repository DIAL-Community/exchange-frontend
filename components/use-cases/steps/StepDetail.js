import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import Breadcrumb from '../../shared/breadcrumb'
import { HtmlViewer } from '../../shared/HtmlViewer'
import RepositoryMarkdown from '../../shared/RepositoryMarkdown'
import { useUser } from '../../../lib/hooks'
import { USE_CASE_STEP_QUERY } from '../../../queries/use-case-step'
import UseCaseStepDetailDatasets from './UseCaseStepDetailDatasets'
import UseCaseStepDetailProducts from './UseCaseStepDetailProducts'
import UseCaseStepDetailWorkflows from './UseCaseStepDetailWorkflows'
import UseCaseStepDetailBuildingBlocks from './UseCaseStepDetailBuildingBlocks'

const UseCaseStepInformation = ({ useCaseStep, canEdit }) => {
  const slugNameMapping = (() => {
    const map = {}
    map[useCaseStep.useCase.slug] = useCaseStep.useCase.name
    map[useCaseStep.slug] = useCaseStep.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      {!useCaseStep.markdownUrl &&
        <HtmlViewer
          initialContent={useCaseStep?.useCaseStepDescription?.description}
          className='px-4 border border-dial-gray card-drop-shadow'
        />
      }
      {useCaseStep.markdownUrl && <RepositoryMarkdown entityWithMarkdown={useCaseStep} canEdit={canEdit} />}
      {useCaseStep.workflows && <UseCaseStepDetailWorkflows useCaseStep={useCaseStep} canEdit={canEdit} />}
      {useCaseStep.buildingBlocks && <UseCaseStepDetailBuildingBlocks useCaseStep={useCaseStep} canEdit={canEdit} />}
      {useCaseStep.datasets && <UseCaseStepDetailDatasets useCaseStep={useCaseStep} canEdit={canEdit} />}
      {useCaseStep.products && <UseCaseStepDetailProducts useCaseStep={useCaseStep} canEdit={canEdit} />}
    </div>
  )
}

const StepDetail = ({ stepSlug, locale }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { isAdminUser: canEdit } = useUser()

  const { loading, data } = useQuery(USE_CASE_STEP_QUERY, {
    variables: { slug: stepSlug },
    context: { headers: { 'Accept-Language': locale } }
  })

  return (
    <>
      {
        loading &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm'>
            {format('step.loading.indicator')}
          </div>
      }
      {data?.useCaseStep && <UseCaseStepInformation useCaseStep={data.useCaseStep} canEdit={canEdit} />}
    </>
  )
}

export default StepDetail
