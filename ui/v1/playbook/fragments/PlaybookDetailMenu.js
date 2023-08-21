import { useState } from 'react'
import { FaRegFilePdf } from 'react-icons/fa'
import { ImEmbed } from 'react-icons/im'
import { useIntl } from 'react-intl'
import { FiMove } from 'react-icons/fi'
import { useUser } from '../../../../lib/hooks'
import CreateButton from '../../shared/form/CreateButton'
import EditButton from '../../shared/form/EditButton'
import DeletePlaybook from '../DeletePlaybook'
import RearrangePlay from '../../play/RearrangePlay'
import PlaybookDetailEmbed from './PlaybookEmbedDetail'

const PlaybookDetailMenu = ({ playbook, locale, allowEmbedCreation }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const [displayEmbedDialog, setDisplayEmbedDialog] = useState(false)

  const [displayDragable, setDisplayDragable] = useState(false)
  const onDragableClose = () => {
    setDisplayDragable(false)
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
          <div className='ml-auto flex items-center gap-2'>
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
              <button onClick={openEmbedDialog} className='bg-dial-iris-blue px-2 py-0.5 rounded text-white'>
                <ImEmbed className='inline pb-px' />
                <span className='text-sm px-1'>{format('ui.playbook.openEmbedDialog')}</span>
              </button>
            }
          </div>
          <div className='ml-auto flex items-center gap-2'>
            {canEdit && <CreateButton label={format('ui.play.add')} type='link' href={generateAddPlayLink()} />}
            {canEdit &&
              <button
                type='button'
                onClick={() => setDisplayDragable(!displayDragable)}
                className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-white'
              >
                <FiMove className='inline pb-0.5' />
                <span className='text-sm px-1'>
                  {format('ui.play.rearrange')}
                </span>
              </button>
            }
            {canEdit && <EditButton type='link' href={generateEditLink()} />}
            {isAdminUser && <DeletePlaybook playbook={playbook} />}
          </div>
          <RearrangePlay
            playbook={playbook}
            displayDragable={displayDragable}
            onDragableClose={onDragableClose}
          />
        </div>
      </div>
    </>
  )
}

export default PlaybookDetailMenu
