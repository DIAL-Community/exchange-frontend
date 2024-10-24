import { useCallback, useState } from 'react'
import { FaRegFilePdf } from 'react-icons/fa'
import { FiMove } from 'react-icons/fi'
import { ImEmbed } from 'react-icons/im'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import RearrangePlay from '../../play/RearrangePlay'
import CreateButton from '../../shared/form/CreateButton'
import EditButton from '../../shared/form/EditButton'
import DeletePlaybook from '../DeletePlaybook'
import PlaybookDetailEmbed from './PlaybookEmbedDetail'

const PlaybookDetailMenu = ({ playbook, locale, allowEmbedCreation }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const editingAllowed = isAdminUser || isEditorUser

  const [displayEmbedDialog, setDisplayEmbedDialog] = useState(false)

  const [displayDraggable, setDisplayDraggable] = useState(false)
  const onDraggableClose = () => {
    setDisplayDraggable(false)
  }

  const generateEditLink = () => {
    return `/${locale}/playbooks/${playbook.slug}/edit`
  }

  const generateAddPlayLink = () => {
    return `/${locale}/playbooks/${playbook.slug}/plays/create`
  }

  const generatePdfLink = () => {
    return `/${locale}/playbooks/${playbook.slug}/pdf`
  }

  const openEmbedDialog = (event) => {
    event.preventDefault()
    setDisplayEmbedDialog(!displayEmbedDialog)
  }

  return (
    <>
      <PlaybookDetailEmbed displayed={displayEmbedDialog} setDisplayed={setDisplayEmbedDialog} />
      <div className='flex flex-col xl:flex-row'>
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
            {allowEmbedCreation &&
              <button type='button' onClick={openEmbedDialog} className='bg-dial-iris-blue px-2 py-0.5 rounded text-white'>
                <ImEmbed className='inline pb-px' />
                <span className='text-sm px-1'>{format('ui.playbook.openEmbedDialog')}</span>
              </button>
            }
          </div>
          <div className='ml-auto flex flex-wrap justify-end gap-2'>
            {editingAllowed && <CreateButton label={format('ui.play.add')} type='link' href={generateAddPlayLink()} />}
            {editingAllowed &&
              <button
                type='button'
                onClick={() => setDisplayDraggable(!displayDraggable)}
                className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-white'
              >
                <FiMove className='inline pb-0.5' />
                <span className='text-sm px-1'>
                  {format('ui.play.rearrange')}
                </span>
              </button>
            }
            {editingAllowed && <EditButton type='link' href={generateEditLink()} />}
            {isAdminUser && <DeletePlaybook playbook={playbook} />}
          </div>
          <RearrangePlay
            playbook={playbook}
            displayDraggable={displayDraggable}
            onDraggableClose={onDraggableClose}
          />
        </div>
      </div>
    </>
  )
}

export default PlaybookDetailMenu
