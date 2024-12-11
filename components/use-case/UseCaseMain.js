import { useContext } from 'react'
import { CollectionDisplayType, FilterContext } from '../context/FilterContext'
import UseCaseMainLeft from './UseCaseMainLeft'
import UseCaseMainRight from './UseCaseMainRight'

const UseCaseMain = ({ activeTab }) => {
  const { collectionDisplayType } = useContext(FilterContext)

  const listDisplay =  (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <UseCaseMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <UseCaseMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )

  const gridDisplay = (
    <div className='px-4 lg:px-8 xl:px-56'>
      <UseCaseMainRight activeTab={activeTab} />
    </div>
  )

  return  collectionDisplayType === CollectionDisplayType.LIST ? listDisplay : gridDisplay
}

export default UseCaseMain
