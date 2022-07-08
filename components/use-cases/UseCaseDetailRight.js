import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useSession } from 'next-auth/client'
import Breadcrumb from '../shared/breadcrumb'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import WorkflowCard from '../workflows/WorkflowCard'
import StepList from './steps/StepList'
import UseCaseDetailSdgTargets from './UseCaseDetailSdgTargets'
import UseCaseDetailTags from './UseCaseDetailTags'

const UseCaseDetailRight = ({ useCase, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  const [session] = useSession()

  const generateCreateStepLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    const { userEmail, userToken } = session.user

    return `
      ${process.env.NEXT_PUBLIC_RAILS_SERVER}/use_cases/${useCase.slug}/use_case_steps/new?user_email=${userEmail}&user_token=${userToken}
    `
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
          {
            session && session.user.canEdit &&
              <a href={generateCreateStepLink()}>
                <span className='grid justify-end text-dial-teal'>{format('step.create-new')}</span>
              </a>
          }
        </div>
        <div className='card-title mb-3 text-dial-gray-dark'>{format('useCaseStep.header')}</div>
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
    </div>
  )
}

export default UseCaseDetailRight
