import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import classNames from 'classnames'
import { useUser } from '../../lib/hooks'
import EditButton from '../shared/EditButton'
import DeleteSector from './DeleteSector'

const SectorCard = ({ sector, listType, displayEditButtons = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [ session ] = useSession()
  const { isAdminUser } = useUser(session)

  return (
    <>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent'>
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
    </>
  )
}

export default SectorCard
