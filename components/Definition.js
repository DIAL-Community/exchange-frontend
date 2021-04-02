import { useState } from 'react'
import { useIntl } from 'react-intl'

const Description = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [openTab, setOpenTab] = useState(1)

  const tabClickHandler = (e, tabNumber) => {
    e.preventDefault()
    setOpenTab(tabNumber)
  }

  const generateAnchorStyles = (tabNumber) => `
    px-5 py-3 rounded-l-lg block leading-loose tracking-wide whitespace-nowrap xl:pr-24
    ${openTab === tabNumber ? 'font-bold text-blue-500 bg-blue-100' : 'text-gray-600 bg-white'}
  `

  const actorList = [
    'Donors', 'Policy Makers', 'Implementing Partners', 'Technology and ICT Partners',
    'Technology Specialists'
  ]

  return (
    <div className='hidden lg:block description-with-wizard'>
      <div className='relative pb-8 sm:pb-16 md:pb-20 xl:pb-32 2xl:max-w-full'>
        <main className='pt-6 mx-auto px-6 sm:pt-12 sm:px-12 lg:pt-16 xl:pt-16 xl:max-w-6xl 2xl:max-w-7xl'>
          <div className='text-xl text-gray-900 md:text-2xl xl:text-3xl xl:leading-landing py-8'>
            {format('definition.subtitle')}
          </div>
          <div className='flex'>
            <ul className='flex flex-col mb-0 list-none' role='tablist'>
              {
                actorList.map((actor, index) => (
                  <li key={`actor-${index}`} className='-mb-px'>
                    <a
                      data-toggle='tab' href={`#${actor.replace(/\s+/g, '-').toLowerCase()}`} role='tablist'
                      className={generateAnchorStyles(index)} onClick={e => tabClickHandler(e, index)}
                    >
                      {actor}
                    </a>
                  </li>
                ))
              }
            </ul>
            <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded-b bg-gradient-to-r from-blue-100'>
              <div className='px-4 py-5'>
                <div className='tab-content tab-space'>
                  <div className={openTab === 0 ? 'block' : 'hidden'} id='donors'>
                    <div className='flex flex-col flex-wrap p-8 max-h-96'>
                      <p className='text-xl max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>Donors </span>
                        can use this tool to identify what ICT Building Blocks and Products deliver various needed
                        workflows, or business process, to deliver development programming or various digital initiatives.
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia cursus fringilla. Aliquam eleifend,
                        nunc vitae volutpat porta, augue quam elementum leo, nec consequat dolor dui eget leo.
                      </p>
                      <img className='rounded-lg shadow-2xl object-cover w-56 h-56' src='images/workflow-placeholder.png' alt='' />
                    </div>
                  </div>
                  <div className={openTab === 1 ? 'block' : 'hidden'} id='policy-makers'>
                    <div className='flex flex-col flex-wrap p-8 max-h-96'>
                      <p className='text-xl max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>Policy Makers </span>
                        can use this tool to identify what ICT Building Blocks and Products deliver various needed
                        workflows, or business process, to deliver development programming or various digital initiatives.
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia cursus fringilla. Aliquam eleifend,
                        nunc vitae volutpat porta, augue quam elementum leo, nec consequat dolor dui eget leo.
                      </p>
                      <img className='rounded-lg shadow-2xl object-cover w-56 h-56' src='images/workflow-placeholder.png' alt='' />
                    </div>
                  </div>
                  <div className={openTab === 2 ? 'block' : 'hidden'} id='implementing-partners'>
                    <div className='flex flex-col flex-wrap p-8 max-h-96'>
                      <p className='text-xl max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>Implementing Partners </span>
                        can use this tool to identify what ICT Building Blocks and Products deliver various needed
                        workflows, or business process, to deliver development programming or various digital initiatives.
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia cursus fringilla. Aliquam eleifend,
                        nunc vitae volutpat porta, augue quam elementum leo, nec consequat dolor dui eget leo.
                      </p>
                      <img className='rounded-lg shadow-2xl object-cover w-56 h-56' src='images/workflow-placeholder.png' alt='' />
                    </div>
                  </div>
                  <div className={openTab === 3 ? 'block' : 'hidden'} id='tech-ict-partners'>
                    <div className='flex flex-col flex-wrap p-8 max-h-96'>
                      <p className='text-xl max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>Technology and ICT Partners </span>
                        can use this tool to identify what ICT Building Blocks and Products deliver various needed
                        workflows, or business process, to deliver development programming or various digital initiatives.
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia cursus fringilla. Aliquam eleifend,
                        nunc vitae volutpat porta, augue quam elementum leo, nec consequat dolor dui eget leo.
                      </p>
                      <img className='rounded-lg shadow-2xl object-cover w-56 h-56' src='images/workflow-placeholder.png' alt='' />
                    </div>
                  </div>
                  <div className={openTab === 4 ? 'block' : 'hidden'} id='tech-specialists'>
                    <div className='flex flex-col flex-wrap p-8 max-h-96'>
                      <p className='text-xl max-w-md mr-16 tracking-wide'>
                        <span className='font-bold'>Technology Specialists </span>
                        can use this tool to identify what ICT Building Blocks and Products deliver various needed
                        workflows, or business process, to deliver development programming or various digital initiatives.
                      </p>
                      <p className='text-base max-w-md pt-4 tracking-wide'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia cursus fringilla. Aliquam eleifend,
                        nunc vitae volutpat porta, augue quam elementum leo, nec consequat dolor dui eget leo.
                      </p>
                      <img className='rounded-lg shadow-2xl object-cover w-56 h-56' src='images/workflow-placeholder.png' alt='' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Description
