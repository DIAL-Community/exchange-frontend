import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import Breadcrumb from '../../shared/breadcrumb'
import { HtmlViewer } from '../../shared/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import { USE_CASE_STEP_QUERY } from '../../../queries/use-case-step'
import NotFound from '../../shared/NotFound'
import { Error, Loading } from '../../shared/FetchStatus'
import UseCaseStepDetailDatasets from './UseCaseStepDetailDatasets'
import UseCaseStepDetailProducts from './UseCaseStepDetailProducts'
import UseCaseStepDetailWorkflows from './UseCaseStepDetailWorkflows'
import UseCaseStepDetailBuildingBlocks from './UseCaseStepDetailBuildingBlocks'

const UseCaseStepInformation = ({ useCaseStep, useCase, canEdit }) => {
  const slugNameMapping = (() => {
    const map = {}
    map[useCase.slug] = useCase.name
    map[useCaseStep.slug] = useCaseStep.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <HtmlViewer
        initialContent={useCaseStep?.useCaseStepDescription?.description}
        className='px-6 pt-6 border border-dial-gray card-drop-shadow'
      />
      {useCaseStep.workflows &&
        <UseCaseStepDetailWorkflows
          useCaseStep={useCaseStep}
          useCase={useCase}
          canEdit={canEdit}
        />
      }
      {useCaseStep.buildingBlocks &&
        <UseCaseStepDetailBuildingBlocks
          useCaseStep={useCaseStep}
          useCase={useCase}
          canEdit={canEdit}
        />
      }
      {useCaseStep.datasets &&
        <UseCaseStepDetailDatasets
          useCaseStep={useCaseStep}
          useCase={useCase}
          canEdit={canEdit}
        />
      }
      {useCaseStep.products &&
        <UseCaseStepDetailProducts
          useCaseStep={useCaseStep}
          useCase={useCase}
          canEdit={canEdit}
        />
      }
    </div>
  )
}

const StepDetail = ({ useCaseSlug, stepSlug, locale }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const { error, loading, data } = useQuery(USE_CASE_STEP_QUERY, {
    variables: { slug: stepSlug, useCaseSlug },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.useCaseStep && !data?.useCase) {
    return <NotFound />
  }

  return (
    <>
      {
        loading &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm'>
            {format('step.loading.indicator')}
          </div>
      }
      {data?.useCaseStep &&
        <UseCaseStepInformation
          useCaseStep={data.useCaseStep}
          useCase={data.useCase}
          canEdit={canEdit && !data.useCase.markdownUrl}
        />
      }
    </>
  )
}

export default StepDetail
