import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import ExtraAttributeDefinitionDetailHeader from './fragments/ExtraAttributeDefinitionDetailHeader'
import ExtraAttributeDefinitionDetailNav from './fragments/ExtraAttributeDefinitionDetailNav'

const ExtraAttributeDefinitionDetailLeft = ({ scrollRef, extraAttributeDefinition }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ExtraAttributeDefinitionDetailHeader extraAttributeDefinition={extraAttributeDefinition}/>
        <hr className='border-b border-dial-slate-200'/>
        <ExtraAttributeDefinitionDetailNav extraAttributeDefinition={extraAttributeDefinition} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={extraAttributeDefinition} objectType={ObjectType.EXTRA_ATTRIBUTE_DEFINITION} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.extraAttributeDefinition.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default ExtraAttributeDefinitionDetailLeft
