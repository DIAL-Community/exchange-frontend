import { useIntl } from 'react-intl'

import Breadcrumb from '../shared/breadcrumb'
import WorkflowCard from '../workflows/WorkflowCard'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import ReactHtmlParser from 'react-html-parser'
import StepList from './steps/StepList'

import { useSession } from 'next-auth/client'
import Link from 'next/link'

import { convertToKey } from '../context/FilterContext'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

const UseCaseDetailRight = ({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  const [session] = useSession()
  const { locale } = useRouter()

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
        {ReactHtmlParser(descriptionByLocale(useCase.useCaseDescriptions, locale))}
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
              {useCase.useCaseHeaders[0] && ReactHtmlParser(useCase.useCaseHeaders[0].header)}
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
      {
        useCase.sdgTargets && useCase.sdgTargets.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('sdg.sdgTargets')}</div>
            <div className='grid grid-cols-1'>
              {
                useCase.sdgTargets.map((sdgTarget, index) => {
                  return (
                    <Link key={index} href={`/${convertToKey('SDGs')}/${sdgTarget.sustainableDevelopmentGoal.slug}`}>
                      <div className='border-3 border-transparent hover:border-dial-yellow text-use-case hover:text-dial-yellow cursor-pointer'>
                        <div className='bg-white border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                          <div className='flex flex-row text-dial-gray-dark'>
                            <div className='px-4 my-auto text-sm font-semibold text-dial-yellow w-3/12 md:w-2/12'>
                              {`${format('sdg.target.title')}: ${sdgTarget.targetNumber}`}
                            </div>
                            <div className='my-2 text-sm w-9/12 md:w-10/12'>
                              {sdgTarget.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
              }
            </div>
          </div>
      }
      {
        useCase.buildingBlocks && useCase.buildingBlocks.length > 0 &&
          <div className='mt-12 mb-4'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('building-block.header')}</div>
            <div className='grid grid-cols-1'>
              {useCase.buildingBlocks.map((buildingBlock, i) => <BuildingBlockCard key={i} buildingBlock={buildingBlock} listType='list' />)}
            </div>
          </div>
      }
    </div>
  )
}

export default UseCaseDetailRight
