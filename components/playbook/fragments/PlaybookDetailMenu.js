import { useCallback, useState } from 'react'
import { FaRegFilePdf } from 'react-icons/fa6'
import { FiMove } from 'react-icons/fi'
import { ImEmbed } from 'react-icons/im'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import CreateButton from '../../shared/form/CreateButton'
import EditButton from '../../shared/form/EditButton'
import RearrangePlays from '../forms/RearrangePlays'
import DeletePlaybook from './DeletePlaybook'
import PlaybookDetailEmbed from './PlaybookEmbedDetail'

const PlaybookDetailMenu = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [displayEmbedDialog, setDisplayEmbedDialog] = useState(false)

  const { loadingUserSession, user } = useUser()
  const allowedToEdit = () => user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser

  const [displayRearrangeDialog, setDisplayRearrangeDialog] = useState(false)
  const onRearrangeDialogClose = () => {
    setDisplayRearrangeDialog(false)
  }

  const generateEditLink = () => {
    return `/playbooks/${playbook.slug}/edit`
  }

  const generateAddPlayLink = () => {
    return `/playbooks/${playbook.slug}/plays/create`
  }

  const generatePdfLink = () => {
    return `/playbooks/${playbook.slug}/pdf`
  }

  const openEmbedDialog = (event) => {
    event.preventDefault()
    setDisplayEmbedDialog(!displayEmbedDialog)
  }

  return (
    <div className='flex flex-col xl:flex-row gap-3 '>
      {loadingUserSession
        ? <div className='absolute top-2 right-2'>{format('general.loadingData')}</div>
        : (
          <div className='flex flex-col gap-3 ml-auto mt-3'>
            <div className='ml-auto flex justify-end gap-2'>
              <a
                href={generatePdfLink()}
                target='_blank'
                rel='noreferrer'
                className='bg-dial-iris-blue px-2 py-0.5 rounded text-white'
              >
                <FaRegFilePdf className='inline pb-px' />
                <span className='text-sm px-1'>{format('app.printPdf')}</span>
              </a>
              <button type='button' onClick={openEmbedDialog} className='bg-dial-iris-blue px-2 py-0.5 rounded text-white'>
                <ImEmbed className='inline pb-px' />
                <span className='text-sm px-1'>{format('ui.playbook.openEmbedDialog')}</span>
              </button>
            </div>

            <div className='ml-auto flex flex-wrap justify-end gap-2'>
              {allowedToEdit() &&
                <CreateButton
                  type='link'
                  label={format('ui.play.add')}
                  href={generateAddPlayLink()}
                />
              }
              {allowedToEdit() &&
                <button
                  type='button'
                  onClick={() => setDisplayRearrangeDialog(!displayRearrangeDialog)}
                  className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-dial-cotton'
                >
                  <FiMove className='inline pb-0.5' />
                  <span className='text-sm px-1'>
                    {format('ui.play.rearrange')}
                  </span>
                </button>
              }
              {allowedToEdit() && <EditButton type='link' href={generateEditLink()} />}
              {user?.isAdminUser && <DeletePlaybook playbook={playbook} />}
            </div>
          </div>
        )}
      <RearrangePlays
        onRearrangeDialogClose={onRearrangeDialogClose}
        displayRearrangeDialog={displayRearrangeDialog}
        playbook={playbook}
      />
      <PlaybookDetailEmbed displayed={displayEmbedDialog} setDisplayed={setDisplayEmbedDialog} />
    </div>
  )
}

export default PlaybookDetailMenu
