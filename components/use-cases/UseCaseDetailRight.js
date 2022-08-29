import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useSession } from 'next-auth/client'
import Breadcrumb from '../shared/breadcrumb'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import CreateButton from '../shared/CreateButton'
import WorkflowCard from '../workflows/WorkflowCard'
import CommentsSection from '../shared/CommentsSection'
import { ObjectType } from '../../lib/constants'
import StepList from './steps/StepList'
import UseCaseDetailSdgTargets from './UseCaseDetailSdgTargets'
import UseCaseDetailTags from './UseCaseDetailTags'

const UseCaseDetailRight = ({ useCase, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)
  const [session] = useSession()

  const generateCreateStepLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return`/use_cases/${useCase.slug}/use_case_steps/create`
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
      <div className='card-title mb-3 text-dial-gray-dark'>{format('useCase.description')}</div>
      <div className='fr-view text-dial-gray-dark'>
        {useCase.useCaseDescription && parse(useCase.useCaseDescription.description)}
      </div>
      <div className='mt-12'>
        <div className='self-center place-self-end text-sm'>
        </div>
        <div className='flex justify-between mb-2'>
          <div className='card-title text-dial-gray-dark self-center'>{format('useCaseStep.header')}</div>
          {canEdit && <CreateButton type='link' label={format('use-case-step.create')} href={generateCreateStepLink()}/>}
        </div>
        {
          useCase.useCaseHeaders && useCase.useCaseHeaders.length > 0 &&
            <div className='fr-view'>
              {useCase.useCaseHeaders[0] && parse(useCase.useCaseHeaders[0].header)}
            </div>
        }
        <StepList useCaseSlug={useCase.slug} />
      </div>
      {
        useCase.workflows && useCase.workflows.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('workflow.header')}</div>
            <div className='grid grid-cols-1'>
              {useCase.workflows.map((workflow, i) => <WorkflowCard key={i} workflow={workflow} listType='list' />)}
            </div>
          </div>
      }
      {useCase.sdgTargets && <UseCaseDetailSdgTargets useCase={useCase} canEdit={canEdit} />}
      {
        useCase.buildingBlocks && useCase.buildingBlocks.length > 0 &&
          <div className='mt-12 mb-4'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('building-block.header')}</div>
            <div className='grid grid-cols-1'>
              {useCase.buildingBlocks.map((buildingBlock, i) => <BuildingBlockCard key={i} buildingBlock={buildingBlock} listType='list' />)}
            </div>
          </div>
      }
      {useCase.tags && <UseCaseDetailTags useCase={useCase} canEdit={canEdit} />}
      <CommentsSection objectId={useCase.id} objectType={ObjectType.USE_CASE} />
    </div>
  )
}

export default UseCaseDetailRight
