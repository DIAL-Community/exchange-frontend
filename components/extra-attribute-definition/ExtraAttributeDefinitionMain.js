import ExtraAttributeDefinitionMainLeft from './ExtraAttributeDefinitionMainLeft'
import ExtraAttributeDefinitionMainRight from './ExtraAttributeDefinitionMainRight'

const ExtraAttributeDefinitionMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <ExtraAttributeDefinitionMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <ExtraAttributeDefinitionMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default ExtraAttributeDefinitionMain
