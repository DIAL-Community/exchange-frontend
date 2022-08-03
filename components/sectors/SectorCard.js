import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import classNames from 'classnames'
import { useState } from 'react'
import { useUser } from '../../lib/hooks'
import EditButton from '../shared/EditButton'
import DeleteSector from './DeleteSector'
import SectorDetail from './SectorDetail'

const SectorCard = ({ sector, listType, displayEditButtons = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [ session ] = useSession()
  const { isAdminUser } = useUser(session)

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const toggleSectorDetailDialog = () => setIsDetailDialogOpen(!isDetailDialogOpen)
  
  return (
    <>
      {
        listType === 'list'
          ? (
            <div onClick={toggleSectorDetailDialog} className={classNames({ 'cursor-pointer hover:border-dial-yellow text-button-gray': displayEditButtons }, 'border-3 border-transparent')}>
              <div className='border border-dial-gray card-drop-shadow'>
                <div className='flex justify-between my-5 px-4'>
                  <div className={classNames({ 'w-1/2 md:w-3/4': displayEditButtons }, 'inline-block font-semibold text-button-gray')}>
                    {sector.name}
                  </div>
                  {isAdminUser && displayEditButtons &&
                    <div className='inline-flex gap-x-1.5 items-center'>
                      <EditButton />
                      <DeleteSector sector={sector} />
                    </div>
                  }
                </div>
              </div>
            </div>
          )
          : <div>{format('sector.label')}</div>
      }
      {isAdminUser && displayEditButtons &&
        <SectorDetail sector={sector} isOpen={isDetailDialogOpen} onClose={toggleSectorDetailDialog} />
      }
    </>
  )
}

export default SectorCard
