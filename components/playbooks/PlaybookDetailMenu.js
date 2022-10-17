import { Dialog, Transition } from '@headlessui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Fragment, useContext, useState } from 'react'
import { FaCode, FaCopy } from 'react-icons/fa'
import { VscClose } from 'react-icons/vsc'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import CommentsCount from '../shared/CommentsCount'
import { ObjectType } from '../../lib/constants'
import DeletePlaybook from './DeletePlaybook'

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
    ${format('playbook.embed.unsupported')}
    </iframe>
  `

  const copyEmbedCode = () => {
    if (navigator.clipboard && embedCode) {
      navigator.clipboard.writeText(embedCode)
        .then(() => {
          showToast(format('playbook.embed.copySuccess'), 'success', 'top-center')
        }, () => {
          showToast(format('playbook.embed.copyFailed'), 'error', 'top-center')
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
                  {format('playbook.embed.title')}
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
                    <span className='text-sm font-medium'>{format('playbook.embed.copy')}</span>
                  </div>
                </div>
                <pre>
                  {embedCode}
                </pre>
              </div>
              <div className='text-sm italic pt-2'>
                {format('playbook.embed.description')}
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

  const { data: session } = useSession()
  const [displayEmbedDialog, setDisplayEmbedDialog] = useState(false)

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/${locale}/playbooks/${playbook.slug}/edit`
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
      <div className='flex'>
        <div className='hidden lg:block'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='mt-4 ml-auto flex items-center gap-3'>
          <CommentsCount
            commentsSectionRef={commentsSectionRef}
            objectId={playbook.id}
            objectType={ObjectType.PLAYBOOK}
          />
          <a href={generatePdfLink()} target='_blank' rel='noreferrer' className='bg-dial-blue px-2 py-0.5 rounded text-white'>
            <img src='/icons/pdf.svg' className='inline mr-2 pb-1' alt='Print PDF' height='12px' width='12px' />
            <span className='text-sm px-2'>{format('app.print-pdf')}</span>
          </a>
          {allowEmbedCreation &&
            <a onClick={openEmbedDialog} className='cursor-pointer bg-dial-blue px-2 py-0.5 rounded text-white'>
              <FaCode className='inline' />
              <span className='text-sm px-2'>{format('playbook.openEmbedDialog')}</span>
            </a>
          }
          {session?.user.canEdit && <EditButton type='link' href={generateEditLink()} />}
          {session?.user.canEdit && <DeletePlaybook playbook={playbook} />}
        </div>
      </div>
    </>
  )
}

export default PlaybookDetailMenu
