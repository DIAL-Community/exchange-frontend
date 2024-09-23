import { useState } from 'react'
import { BsChevronBarDown, BsChevronUp } from 'react-icons/bs'
import { FiEdit3 } from 'react-icons/fi'
import { FormattedMessage } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import MenuConfigurationEditorForm from './MenuConfigurationEditorForm'

const MenuConfigurationEditor = ({ menuConfiguration }) => {
  const [editing, setEditing] = useState(false)
  const [openingDetail, setOpeningDetail] = useState(false)

  const toggleEditing = () => setEditing(!editing)
  const toggleDetail = () => setOpeningDetail(!openingDetail)

  const { user } = useUser()
  const allowedToEdit = () => user?.isAdminUser || user?.isEditorUser

  return (
    <div className='flex flex-col'>
      <div className='collapse-header'>
        <div className='collapse-animation-base bg-dial-blue-chalk h-14' />
        <div className='flex flex-row flex-wrap gap-3 collapse-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleDetail}>
            <div className='font-semibold px-4 py-4'>
              {menuConfiguration.name}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2 pb-3 lg:pb-0'>
              {allowedToEdit() &&
                <button
                  type='button'
                  onClick={toggleEditing}
                  className='cursor-pointer bg-white px-2 py-0.5 rounded'
                >
                  {!editing && <FiEdit3 className='inline pb-0.5 text-dial-stratos ' />}
                  <span className='text-sm px-1 text-dial-stratos'>
                    {!editing && <FormattedMessage id='app.edit' />}
                    {editing && <FormattedMessage id='app.cancel' />}
                  </span>
                </button>
              }
              <button
                type='button'
                onClick={toggleDetail}
                className='cursor-pointer bg-white px-2 py-1.5 rounded'
              >
                {openingDetail
                  ? <BsChevronUp className='cursor-pointer p-01 text-dial-stratos' />
                  : <BsChevronBarDown className='cursor-pointer p-0.5 text-dial-stratos' />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${openingDetail ? 'slide-down' : 'slide-up'} border`}>
        {editing
          ? <MenuConfigurationEditorForm menuConfiguration={menuConfiguration} toggleEditing={toggleEditing} />
          : <div className='px-4 py-4'>
            Nulla quis tortor non mi auctor hendrerit. Aenean venenatis sit amet enim a fringilla.
            Sed vitae ante felis. Ut dolor dolor, semper at feugiat vel, fringilla mattis metus.
            Nullam eros nulla, egestas a convallis et, volutpat quis est. Suspendisse eleifend
            pulvinar sagittis. Morbi leo enim, ultrices vel odio at, tincidunt congue leo.
            Vestibulum sit amet metus convallis, efficitur est at, suscipit urna. Aenean ultricies
            nisl in malesuada venenatis. Fusce efficitur dictum turpis eget dapibus.
          </div>
        }
      </div>
    </div>
  )
}

export default MenuConfigurationEditor
