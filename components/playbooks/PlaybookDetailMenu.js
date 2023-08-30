import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useContext, useState } from 'react'
import { FaCopy, FaRegFilePdf } from 'react-icons/fa'
import { ImEmbed } from 'react-icons/im'
import { VscClose } from 'react-icons/vsc'
import { useIntl } from 'react-intl'
import { FiMove } from 'react-icons/fi'
import { ToastContext } from '../../lib/ToastContext'
import Breadcrumb from '../shared/breadcrumb'
import CreateButton from '../shared/CreateButton'
import EditButton from '../shared/EditButton'
import CommentsCount from '../shared/CommentsCount'
import { ObjectType } from '../../lib/constants'
import { useUser } from '../../lib/hooks'
import DeletePlaybook from './DeletePlaybook'
import RearrangePlay from './RearrangePlay'

const PlaybookEmbedDetail = ({ displayed, setDisplayed }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { showToast } = useContext(ToastContext)

  const transitionClasses = `
    inline-block w-full max-w-6xl px-5 py-5 overflow-hidden text-left align-middle
    transition-all transform bg-white shadow-xl rounded-2xl
  `

  const embedCode = `
    <iframe
      src="${process.env.NEXT_PUBLIC_GRAPHQL_SERVER}${router.asPath}/embedded"
      width="1200"
      height="800"
      allowfullscreen
      allowtransparency
      allow="autoplay"
      scrolling="yes"
      frameborder="0"
    >
    ${format('ui.playbook.embed.unsupported')}
    </iframe>
  `

  const copyEmbedCode = () => {
    if (navigator.clipboard && embedCode) {
      navigator.clipboard.writeText(embedCode)
        .then(() => {
          showToast(format('ui.playbook.embed.copySuccess'), 'success', 'top-center')
        }, () => {
          showToast(format('ui.playbook.embed.copyFailed'), 'error', 'top-center')
        })
    }
  }

  return (
    <Transition appear show={displayed} as={Fragment}>
      <Dialog as='div' className='fixed inset-0 z-100 overflow-y-auto' onClose={setDisplayed}>
        <div className='min-h-screen px-4 text-center'>
          <Dialog.Overlay className='fixed inset-0 bg-dial-gray opacity-80' />
          <span className='inline-block h-screen align-middle' aria-hidden='true'>&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className={transitionClasses}>
              <Dialog.Title>
                <div className='font-semibold text-xl pb-3'>
                  {format('ui.playbook.embed.title')}
                  <VscClose
                    className='my-auto float-right cursor-pointer opacity-50 hover:opacity-80'
                    onClick={() => setDisplayed(!displayed)}
                  />
                </div>
              </Dialog.Title>
              <div className='border border-dashed'>
                <div onClick={copyEmbedCode} className='float-right px-2 py-1 cursor-pointer'>
                  <div className='flex flex-row gap-1 opacity-50 hover:opacity-80'>
                    <FaCopy className='my-auto' />
                    <span className='text-sm font-medium'>{format('ui.playbook.embed.copy')}</span>
                  </div>
                </div>
                <pre>
                  {embedCode}
                </pre>
              </div>
              <div className='text-sm italic pt-2'>
                {format('ui.playbook.embed.description')}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const PlaybookDetailMenu = ({ playbook, locale, allowEmbedCreation, commentsSectionRef }) => {
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
    if (!canEdit) {
      return '/edit-not-available'
    }

    return `/${locale}/playbooks/${playbook.slug}/edit`
  }

  const generateAddPlayLink = () => {
    if (!canEdit) {
      return '/add-play-not-available'
    }

    return `/${locale}/playbooks/${playbook.slug}/plays/create`
  }

  const generatePdfLink = () => {
    return `/${locale}/playbooks/${playbook.slug}/pdf`
  }

  const slugNameMapping = (() => {
    return { [[playbook.slug]]: playbook.name }
  })()

  const openEmbedDialog = (event) => {
    event.preventDefault()
    setDisplayEmbedDialog(!displayEmbedDialog)
  }

  return (
    <>
      <PlaybookEmbedDetail displayed={displayEmbedDialog} setDisplayed={setDisplayEmbedDialog} />
      <div className='flex flex-col xl:flex-row'>
        <div className='hidden lg:block'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='flex flex-col gap-3 ml-auto mt-3'>
          <div className='ml-auto flex items-center gap-2'>
            <CommentsCount
              commentsSectionRef={commentsSectionRef}
              objectId={playbook.id}
              objectType={ObjectType.PLAYBOOK}
            />
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
              <a onClick={openEmbedDialog} className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-white'>
                <ImEmbed className='inline pb-px' />
                <span className='text-sm px-1'>{format('ui.playbook.openEmbedDialog')}</span>
              </a>
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
