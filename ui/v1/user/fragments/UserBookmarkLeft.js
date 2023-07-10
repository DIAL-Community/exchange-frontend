import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Checkbox from '../../shared/form/Checkbox'

const UserBookmarkLeft = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='bg-dial-slate-100 h-full py-3'>
      <div className='flex flex-col gap-4 px-6 py-3'>
        <div className='text-2xl font-semibold text-dial-blueberry'>
          {format('ui.profile.bookmark')}
        </div>
        <div className='text-sm text-dial-sapphire'>
          {format('ui.filter.title')}:
        </div>
        <hr className='bg-slate-200'/>
        <label className='flex'>
          <Checkbox />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.useCase.header')}
          </span>
        </label>
        <hr className='bg-slate-200'/>
        <label className='flex'>
          <Checkbox />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.buildingBlock.header')}
          </span>
        </label>
        <hr className='bg-slate-200'/>
        <label className='flex'>
          <Checkbox />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.product.header')}
          </span>
        </label>
        <hr className='bg-slate-200'/>
        <label className='flex'>
          <Checkbox />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.sdg.header')}
          </span>
        </label>
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default UserBookmarkLeft
