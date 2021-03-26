import React from 'react'
import { HiQuestionMarkCircle } from 'react-icons/hi'

const Filter = () => {
  const [openTab, setOpenTab] = React.useState(1)

  const filterMenuStyles = (tab) => `
    text-base font-bold px-5 pt-3 pb-4 block leading-normal
    ${tab === openTab ? 'text-white' : 'rounded text-gray-600 bg-dial-gray'}
  `

  const listMenuStyles = (tab) => `
    -mb-px mr-2 last:mr-0 flex-auto
    ${tab === openTab ? 'bg-dial-gray-dark rounded-t' : 'pb-2'}
  `

  const badgeStyles = (tab) => `
    float-right px-2 py-2 text-sm font-bold leading-none rounded
    ${tab === openTab ? 'text-dial-gray-dark bg-dial-yellow' : 'text-dial-gray-dark bg-white'}
  `

  const clickHandler = (e, tabNumber) => {
    e.preventDefault()
    setOpenTab(tabNumber)
  }

  return (
    <>
      <div className='text-center text-3xl font-bold pt-7 pb-5'>
        Catalog of Digital Solutions
      </div>
      <div className='sticky px-2 py-3 bg-white' style={{ top: '60px' }}>
        <div className='hidden xl:block' style={{ maxWidth: 'calc(62.5% - 16px)' }}>
          <div className='px-5 py-2 border-t border-r border-l border-gray-300 rounded-t' />
          <div className='text-center -mt-7' style={{ lineHeight: 0.1 }}>
            <span className='bg-white px-3'>
              <span className='text-sm font-bold text-gray-500'>Digital Investment Framework</span>
              <HiQuestionMarkCircle className='ml-1 inline' />
            </span>
          </div>
        </div>
      </div>
      <div className='sticky bg-white' style={{ top: '85px' }}>
        <span className='flex flex-wrap'>
          <div className='w-full'>
            <ul className='flex mb-0 list-none flex-wrap pt-3 flex-row' role='tablist'>
              {
                [
                  'SDGs', 'Use Cases', 'Workflows', 'Building Blocks', 'Products', 'Projects',
                  'Organizations', 'Map Views'
                ].map((menuTitle, index) => (
                  <li key={`menu-${menuTitle}`} className={`${listMenuStyles(index)} mx-2`}>
                    <a
                      className={filterMenuStyles(index)}
                      onClick={e => clickHandler(e, index)}
                      data-toggle='tab' href='#sdgs' role='tablist'
                    >
                      {menuTitle}
                      <span className={badgeStyles(index)}>
                        200
                      </span>
                    </a>
                  </li>
                ))
              }
            </ul>
            <div className='relative flex flex-col min-w-0 break-words bg-white mb-6 mx-2'>
              <div className='px-4 bg-dial-gray-dark flex-auto'>
                <div className='tab-content tab-space'>
                  <div class='p-2 text-sm text-white'>
                    Filter `tab-name` by
                  </div>
                  <div className={openTab === 1 ? 'block' : 'hidden'} id='link1'>
                    <div className='px-2 pb-2 text-sm text-white'>
                      Some filter goes here
                    </div>
                  </div>
                  <div className={openTab === 2 ? 'block' : 'hidden'} id='link2'>
                    <div className='px-2 pb-2 text-sm text-white'>
                      Some filter goes here
                    </div>
                  </div>
                  <div className={openTab === 3 ? 'block' : 'hidden'} id='link3'>
                    <div className='px-2 pb-2 text-sm text-white'>
                      Some filter goes here
                    </div>
                  </div>
                </div>
              </div>
              <div className='border-b-8 border-dial-yellow rounded-b' />
            </div>
          </div>
        </span>
      </div>
    </>
  )
}

export default Filter
