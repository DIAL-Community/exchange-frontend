import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { useCallback, useState } from 'react'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { useUser } from '../../lib/hooks'
import EditButton from '../shared/EditButton'
import { DisplayType } from '../../lib/constants'
import DeleteSector from './DeleteSector'
import SectorDetail from './SectorDetail'
import SectorForm from './SectorForm'

const SectorCard = ({ sector, listType = DisplayType.LIST, displayEditButtons = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser } = useUser()

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const toggleSectorDetailDialog = () => setIsDetailDialogOpen(!isDetailDialogOpen)

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const toggleSectorFormDialog = () => setIsFormDialogOpen(!isFormDialogOpen)

  return (
    listType === DisplayType.LIST && (
      <div
        className={classNames(
          { 'hover:border-dial-sunshine text-button-gray': displayEditButtons },
          'rounded-md border-3 border-transparent'
        )}
        data-testid='sector-card'
      >
        <div className='flex border border-dial-gray shadow-md px-3 h-16 rounded-md'>
          <div
            onClick={toggleSectorDetailDialog}
            className={classNames({ 'flex-1 cursor-pointer': displayEditButtons }, 'flex items-center')}
          >
            <div
              className={classNames(
                { 'inline-flex items-center gap-x-2': displayEditButtons },
                'inline-block font-semibold text-button-gray'
              )}
            >
              {sector.name}
              {isAdminUser && displayEditButtons && (
                sector?.isDisplayable
                  ? <MdVisibility
                    data-tooltip-id='react-tooltip'
                    data-tooltip-content={format('sector.displayable.tooltip')}
                  />
                  : <MdVisibilityOff
                    data-tooltip-id='react-tooltip'
                    data-tooltip-content={format('sector.not-displayable.tooltip')}
                  />
              )}
            </div>
          </div>
          {isAdminUser && displayEditButtons && (
            <div className='inline-flex items-center gap-x-2'>
              <SectorDetail sector={sector} isOpen={isDetailDialogOpen} onClose={toggleSectorDetailDialog} />
              <EditButton onClick={toggleSectorFormDialog} />
              <SectorForm isOpen={isFormDialogOpen} onClose={toggleSectorFormDialog} sector={sector} />
              <DeleteSector sector={sector} />
            </div>
          )}
        </div>
      </div>
    )
  )
}

export default SectorCard
