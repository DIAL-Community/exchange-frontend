import { useState } from 'react'
import { useIntl } from 'react-intl'
import DigitalPrinciple from '../principles/DigitalPrinciple'
import Resource from '../resources/Resource'

const Lifecycle = ({ wizardData, objType }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  const [openTab, setOpenTab] = useState(objType === 'principles' ? 0 : 1)

  const tabClickHandler = (e, tabNumber) => {
    e.preventDefault()
    setOpenTab(tabNumber)
  }

  const generateAnchorStyles = (tabNumber) => `
    block px-5 py-3 leading-loose tracking-wide whitespace-nowrap xl:pr-24
    ${openTab === tabNumber ? 'rounded-l-lg font-bold text-dial-gray-dark bg-dial-gray' : 'text-dial-gray-dark bg-white'}
  `

  const actorList = [
    format('wizard.ideation'), format('wizard.planning'), format('wizard.implementation'),
    format('wizard.monitoring')
  ]

  return (
    <div className='block'>
      <div className='relative pb-4 lg:pb-6 2xl:max-w-full'>
        <main className='pt-4 mx-auto px-6 sm:px-12 xl:pt-6 xl:max-w-6xl 2xl:max-w-7xl'>
          <div className='grid grid-cols-3'>
            <ul className='flex flex-col mb-0 list-none'>
              {
                actorList.map((actor, index) => (
                  <li key={`actor-${index}`} className='-mb-px'>
                    <a
                      data-toggle='tab' href={`#${actor.replace(/\s+/g, '-').toLowerCase()}`}
                      className={generateAnchorStyles(index)} onClick={e => tabClickHandler(e, index)}
                    >
                      {actor}
                    </a>
                  </li>
                ))
              }
            </ul>
            <div className='col-span-2 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded-b bg-gradient-to-r from-dial-gray to-dial-gray-light'>
              <div className='px-4 py-2'>
                <div className='tab-content tab-space'>
                  {['Ideation', 'Planning', 'Implementation', 'Evaluation'].map((phase, index) => {
                    return objType === 'principles'
                      ? (
                        <div key={phase} className={openTab === index ? 'block' : 'hidden'} id={'principle-phase-' + index}>
                          <div className='pb-2 grid lg:grid-cols-3'>
                            {wizardData.digitalPrinciples.map((principle) => {
                              if (principle.phase.includes(phase)) {
                                return (<div key={`${principle.name}`}><DigitalPrinciple principle={principle} /></div>)
                              }
                            })}
                          </div>
                        </div>
                      )
                      : (
                        <div key={phase} className={openTab === index ? 'block' : 'hidden'} id={'resource-phase-' + index}>
                          <div className='pb-6 grid lg:grid-cols-3'>
                            {wizardData.resources.map((resource) => {
                              if (resource.phase.includes(phase)) {
                                return (<div key={`${resource.name}`}><Resource resource={resource} listType='list' /></div>)
                              }
                            })}
                          </div>
                        </div>
                      )
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Lifecycle
