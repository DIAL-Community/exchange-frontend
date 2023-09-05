import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { WIZARD_EXTENDED_DATA_QUERY } from '../../shared/query/wizard'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import ResourceCard from '../../resource/ResourceCard'
import DigitalPrinciple from '../../principles/DigitalPrinciple'
import { DisplayType } from '../../utils/constants'

const WizardExtendedData = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(WIZARD_EXTENDED_DATA_QUERY)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.wizard) {
    return <NotFound />
  }

  const { wizard } = data

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex flex-col gap-y-1'>
        <div className='text-xl font-semibold text-dial-plum pb-3'>
          {format('wizard.results.phases')}
        </div>
        <div className='text-xs italic'>
          {format('wizard.results.phasesDesc')}
        </div>
      </div>
      <div className='px-4 py-2'>
        {['Ideation', 'Planning', 'Implementation', 'Evaluation'].map((phase, index) => {
          const wizardPrinciples = wizard.digitalPrinciples
            .filter(principle => principle.phase.indexOf(phase) >= 0)
          const wizardResources = wizard.resources
            .filter(resource => resource.phase.indexOf(phase) >= 0)

          return (
            <div key={index} className='flex flex-col gap-y-3 pt-4'>
              <div className='text-lg font-semibold text-dial-iris-blue'>
                {phase}
              </div>
              {wizardPrinciples.length > 0 &&
                <div className='flex flex-col gap-y-3'>
                  <div className='flex flex-col gap-y-2'>
                    <div className='text-sm font-semibold text-dial-plum'>
                      {format('wizard.results.principles')}
                    </div>
                    <div className='text-xs italic'>
                      {format('wizard.results.principlesDesc')}
                    </div>
                  </div>
                  {wizardPrinciples.map((principle, principleIndex) =>
                    <div key={`${principle.name}`}>
                      <DigitalPrinciple principle={principle} index={principleIndex} />
                    </div>
                  )}
                </div>
              }
              {wizardResources.length > 0 &&
                <div className='flex flex-col gap-y-3 pt-3'>
                  <div className='flex flex-col gap-y-2'>
                    <div className='text-sm font-semibold text-dial-plum'>
                      {format('wizard.results.resources')}
                    </div>
                    <div className='text-xs italic'>
                      {format('wizard.results.resourcesDesc')}
                    </div>
                  </div>
                  <div className='grid lg:grid-cols-2 gap-3'>
                    {wizardResources.map(resource =>
                      <div key={`${resource.name}`}>
                        <ResourceCard resource={resource} displayType={DisplayType.SMALL_CARD} />
                      </div>
                    )}
                  </div>
                </div>
              }
              <hr className='border-b border-dial-blue-chalk mt-3' />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WizardExtendedData
