import { useCallback, useState } from 'react'
import { FiMove } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import CreateButton from '../../shared/form/CreateButton'
import EditButton from '../../shared/form/EditButton'
import DeleteCurriculum from './DeleteCurriculum'
import RearrangeModules from './forms/RearrangeModules'

const CurriculumDetailMenu = ({ curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loadingUserSession, user } = useUser()
  const allowedToEdit = () => user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser

  const [displayRearrangeDialog, setDisplayRearrangeDialog] = useState(false)
  const onRearrangeDialogClose = () => {
    setDisplayRearrangeDialog(false)
  }

  const generateEditLink = () => {
    return `/dpi-curriculum/${curriculum.slug}/edit`
  }

  const generateAddModuleLink = () => {
    return `/dpi-curriculum/${curriculum.slug}/dpi-curriculum-module/create`
  }

  return (
    <div className='flex flex-col xl:flex-row gap-3 '>
      {loadingUserSession
        ? <div className='absolute top-2 right-2'>{format('general.loadingData')}</div>
        : (
          <div className='ml-auto flex flex-wrap justify-end gap-2'>
            {allowedToEdit() &&
              <CreateButton
                type='link'
                label={format('dpi.curriculum.module.add')}
                href={generateAddModuleLink()}
              />
            }
            {allowedToEdit() &&
              <button
                type='button'
                onClick={() => setDisplayRearrangeDialog(!displayRearrangeDialog)}
                className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-white'
              >
                <FiMove className='inline pb-0.5' />
                <span className='text-sm px-1'>
                  {format('dpi.curriculum.module.rearrange')}
                </span>
              </button>
            }
            {allowedToEdit() && <EditButton type='link' href={generateEditLink()} />}
            {user?.isAdminUser && <DeleteCurriculum curriculum={curriculum} />}
          </div>
        )}
      <RearrangeModules
        onRearrangeDialogClose={onRearrangeDialogClose}
        displayRearrangeDialog={displayRearrangeDialog}
        curriculum={curriculum}
      />
    </div>
  )
}

export default CurriculumDetailMenu
