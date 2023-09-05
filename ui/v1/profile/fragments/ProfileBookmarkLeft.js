import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import Checkbox from '../../shared/form/Checkbox'
import { ProfileBookmarkContext } from './ProfileBookmarkContext'

const ProfileBookmarkLeft = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    displayUseCases,
    displayProducts,
    displayBuildingBlocks,
    displayUrls
  } = useContext(ProfileBookmarkContext)

  const {
    setDisplayUseCases,
    setDisplayProducts,
    setDisplayBuildingBlocks,
    setDisplayUrls
  } = useContext(ProfileBookmarkContext)

  const toggleDisplayUseCases = () => {
    setDisplayUseCases(!displayUseCases)
  }

  const toggleDisplayBuildingBlocks = () => {
    setDisplayBuildingBlocks(!displayBuildingBlocks)
  }

  const toggleDisplayProducts = () => {
    setDisplayProducts(!displayProducts)
  }

  const toggleDisplayUrls = () => {
    setDisplayUrls(!displayUrls)
  }

  return (
    <div className='bg-dial-slate-100 py-3 h-full'>
      <div className='flex flex-col gap-4 px-6 py-3'>
        <div className='text-2xl font-semibold text-dial-blueberry'>
          {format('ui.profile.bookmark')}
        </div>
        <div className='text-sm text-dial-sapphire'>
          {format('ui.filter.primary.title')}:
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex'>
          <Checkbox onChange={toggleDisplayUseCases} value={displayUseCases} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.useCase.header')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex'>
          <Checkbox  onChange={toggleDisplayBuildingBlocks} value={displayBuildingBlocks}/>
          <span className='mx-2 my-auto text-sm'>
            {format('ui.buildingBlock.header')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex'>
          <Checkbox  onChange={toggleDisplayProducts} value={displayProducts}/>
          <span className='mx-2 my-auto text-sm'>
            {format('ui.product.header')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex'>
          <Checkbox  onChange={toggleDisplayUrls} value={displayUrls}/>
          <span className='mx-2 my-auto text-sm'>
            {format('ui.url.header')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default ProfileBookmarkLeft
