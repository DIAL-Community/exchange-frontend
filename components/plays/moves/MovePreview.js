import { Fragment, useContext, useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { HiExternalLink } from 'react-icons/hi'
import { Dialog, Transition } from '@headlessui/react'
import { FaSpinner } from 'react-icons/fa'
import { MovePreviewContext, MovePreviewDispatchContext } from './MovePreviewContext'

const MOVE_QUERY = gql`
  query Move($playSlug: String!, $slug: String!) {
    move(playSlug: $playSlug, slug: $slug) {
      id
      slug
      name
      resources
      moveDescription {
        description
      }
    }
  }
`

const MovePreview = () => {
  const router = useRouter()
  const { locale } = router

  const [editing, setEditing] = useState(false)

  const { previewSlug, previewContext, previewDisplayed } = useContext(MovePreviewContext)
  const { setPreviewDisplayed } = useContext(MovePreviewDispatchContext)

  const [playbookSlug, playSlug] = previewContext

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [fetchPlayDetail, { data }] = useLazyQuery(MOVE_QUERY, {
    variables: {
      slug: previewSlug,
      playSlug: playSlug
    },
    skip: !previewSlug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    if (previewSlug && previewDisplayed && previewContext) {
      fetchPlayDetail()
    }
  }, [fetchPlayDetail, previewSlug, previewContext, previewDisplayed])

  const navigateToEdit = () => {
    setEditing(true)
    router.push(`/${locale}/playbooks/${playbookSlug}/plays/${playSlug}/moves/${previewSlug}/edit`)
  }

  return (
    <>
      {
        data &&
          <Transition appear show={previewDisplayed} as={Fragment}>
            <Dialog as='div' className='fixed inset-0 z-100 overflow-y-auto' onClose={setPreviewDisplayed}>
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
                  <div
                    className={`
                      inline-block w-full max-w-6xl px-4 pt-4 pb-8 overflow-hidden text-left align-middle
                      transition-all transform bg-white shadow-xl rounded-2xl
                    `}
                  >
                    <Dialog.Title>
                      <div className='flex gap-3 px-4'>
                        <div className='font-semibold text-2xl py-3'>
                          {data.move.name}
                        </div>
                        <div className='ml-auto flex gap-3 py-3'>
                          <button
                            type='button'
                            className='bg-dial-blue text-dial-gray-light py-2 px-4 rounded disabled:opacity-50'
                            onClick={() => navigateToEdit()}
                            disabled={editing}
                          >
                            {format('app.edit')}
                            {editing && <FaSpinner className='spinner ml-3 inline' />}
                          </button>
                          <button
                            type='button'
                            className='bg-button-gray-light text-white py-2 px-4 rounded disabled:opacity-50'
                            onClick={() => setPreviewDisplayed(!previewDisplayed)}
                            disabled={editing}
                          >
                            {format('general.close')}
                          </button>
                        </div>
                      </div>
                    </Dialog.Title>

                    <div className='flex flex-col gap-4 w-5/6 px-4 pb-4'>
                      <div className='fr-view tinyEditor text-dial-gray-dark'>
                        {data.move?.moveDescription && parse(data.move.moveDescription.description)}
                      </div>
                      {
                        data.move?.resources && data?.move?.resources.length > 0 &&
                          <>
                            <div className='font-semibold'>{format('move.resources.header')}</div>
                            <div className='flex flex-wrap gap-3'>
                              {
                                data.move?.resources.map(resource => {
                                  return (
                                    <Link key={resource.i} href={resource.url} passHref>
                                      <a target='_blank' rel='noreferrer'>
                                        <div className='group border-2 border-gray-300 hover:border-dial-yellow card-drop-shadow'>
                                          <div className='flex'>
                                            <div className='flex flex-col gap-2 px-3 py-4'>
                                              <div className='font-semibold'>{resource.name}</div>
                                              <div className='text-sm'>{resource.description}</div>
                                            </div>
                                            <HiExternalLink className='ml-auto px-2' size='2.2em' />
                                          </div>
                                        </div>
                                      </a>
                                    </Link>
                                  )
                                })
                              }
                            </div>
                          </>
                      }
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
      }
    </>
  )
}

export default MovePreview