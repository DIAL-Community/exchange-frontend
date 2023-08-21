import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FaCopy } from 'react-icons/fa6'
import { VscClose } from 'react-icons/vsc'
import { ToastContext } from '../../../../lib/ToastContext'

const PlaybookDetailEmbed = ({ displayed, setDisplayed }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

export default PlaybookDetailEmbed
