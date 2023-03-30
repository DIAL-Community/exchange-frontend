import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Breadcrumb from '../shared/breadcrumb'
import CreateButton from '../shared/CreateButton'
import WorkflowCard from '../workflows/WorkflowCard'
import { HtmlViewer } from '../shared/HtmlViewer'
import CommentsSection from '../shared/comment/CommentsSection'
import { ObjectType } from '../../lib/constants'
import { useUser } from '../../lib/hooks'
import StepList from './steps/StepList'
import UseCaseDetailSdgTargets from './UseCaseDetailSdgTargets'
import UseCaseDetailTags from './UseCaseDetailTags'
import UseCaseBuildingBlock from './UseCaseBuildingBlocks'

const UseCaseDetailRight = ({ useCase, canEdit, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, isAdminUser } = useUser()

  const generateCreateStepLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/use_cases/${useCase.slug}/use_case_steps/create`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[useCase.slug] = useCase.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='card-title mb-3 text-dial-gray-dark'>
        {format('useCase.description')}
      </div>
      <HtmlViewer
        initialContent={useCase?.useCaseDescription?.description}
        editorId='use-case-detail'
        className='-mb-12'
      />
      <div className='mt-12'>
        <div className='self-center place-self-end text-sm'>
        </div>
        <div className='flex justify-between mb-2'>
          <div className='card-title text-dial-gray-dark self-center'>
            {format('useCaseStep.header')}
          </div>
          {isAdminUser &&
            <CreateButton
              type='link'
              label={format('use-case-step.create')}
              href={generateCreateStepLink()}
            />
          }
        </div>
        {useCase?.useCaseHeaders?.length > 0 &&
          <div className='fr-view'>
            {useCase.useCaseHeaders[0] && parse(useCase.useCaseHeaders[0].header)}
          </div>
        }
        <StepList useCaseSlug={useCase.slug} />
      </div>
      {useCase.workflows && useCase.workflows.length > 0 &&
        <div className='mt-12'>
          <div className='card-title mb-3 text-dial-gray-dark'>{format('workflow.header')}</div>
          <div className='grid grid-cols-1'>
            {useCase.workflows.map((workflow, i) =>
              <WorkflowCard key={i} workflow={workflow} listType='list' />)
            }
          </div>
        </div>
      }
      {useCase.sdgTargets && <UseCaseDetailSdgTargets useCase={useCase} canEdit={canEdit} />}
      {useCase.buildingBlocks && useCase.buildingBlocks.length > 0 &&
        <div className='mt-12 mb-4'>
          <div className='card-title mb-3 text-dial-gray-dark'>{format('building-block.header')}</div>
          <UseCaseBuildingBlock useCaseBuildingBlocks={useCase.buildingBlocks} />
        </div>
      }
      {useCase.tags && <UseCaseDetailTags useCase={useCase} canEdit={canEdit} />}
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={useCase.id}
        objectType={ObjectType.USE_CASE}
      />
    </div>
  )
}

export default UseCaseDetailRight
