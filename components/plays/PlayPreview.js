import { Fragment, useContext, useEffect, useState } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { Dialog, Transition } from '@headlessui/react'
import { FaSpinner } from 'react-icons/fa'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import ProductCard from '../products/ProductCard'
import { PlayPreviewContext, PlayPreviewDispatchContext } from './PlayPreviewContext'
import PlayPreviewMove from './PlayPreviewMove'

const PLAY_QUERY = gql`
  query Play($slug: String!) {
    play(slug: $slug) {
      id
      slug
      name
      imageFile
      playDescription {
        id
        description
      }
      playMoves {
        id
        slug
        name
      }
      products {
        id
        name
        slug
        imageFile
      }
      buildingBlocks {
        id
        name
        slug
        imageFile
      }
    }
  }
`

const DUPLICATE_PLAY = gql`
  mutation (
    $playSlug: String!
  ) {
    duplicatePlay (
      playSlug: $playSlug
    ) {
      play {
        id
        slug
      }
    }
  }
`

const PlayPreview = () => {
  const router = useRouter()
  const { locale } = router

  const [editing, setEditing] = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  const { previewSlug, previewContext, previewDisplayed } = useContext(PlayPreviewContext)
  const { setPreviewDisplayed } = useContext(PlayPreviewDispatchContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [duplicatePlay, { data: duplicatedPlay }] = useMutation(DUPLICATE_PLAY)
  const [fetchPlayDetail, { data }] = useLazyQuery(PLAY_QUERY, {
    variables: {
      slug: previewSlug
    },
    skip: !previewSlug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    if (previewSlug && previewContext && previewDisplayed) {
      fetchPlayDetail()
    }
  }, [fetchPlayDetail, previewSlug, previewContext, previewDisplayed])

  useEffect(() => {
    if (duplicating && duplicatedPlay) {
      setDuplicating(false)
      router.push(`/${router.locale}/playbooks/${previewContext}/plays/${duplicatedPlay.duplicatePlay.play.slug}/edit`)
    }
  }, [duplicating, duplicatedPlay, router, previewContext])

  const createDuplicatePlay = () => {
    setDuplicating(true)
    duplicatePlay({
      variables: {
        playSlug: previewSlug
      }
    })
  }

  const navigateToEdit = () => {
    setEditing(true)
    router.push(`/${locale}/playbooks/${previewContext}/plays/${previewSlug}/edit`)
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
                          {data.play.name}
                        </div>
                        <div className='ml-auto flex gap-3 py-3'>
                          <button
                            type='button'
                            className='bg-dial-blue text-dial-gray-light py-2 px-4 rounded disabled:opacity-50'
                            onClick={createDuplicatePlay}
                            disabled={duplicating || editing}
                          >
                            {format('app.duplicate')}
                            {duplicating && <FaSpinner className='spinner ml-3 inline' />}
                          </button>
                          <button
                            type='button'
                            className='bg-dial-blue text-dial-gray-light py-2 px-4 rounded disabled:opacity-50'
                            onClick={() => navigateToEdit()}
                            disabled={duplicating || editing}
                          >
                            {format('app.edit')}
                            {editing && <FaSpinner className='spinner ml-3 inline' />}
                          </button>
                          <button
                            type='button'
                            className='bg-button-gray-light text-white py-2 px-4 rounded disabled:opacity-50'
                            onClick={() => setPreviewDisplayed(!previewDisplayed)}
                            disabled={duplicating || editing}
                          >
                            {format('general.close')}
                          </button>
                        </div>
                      </div>
                    </Dialog.Title>

                    <div className='flex flex-col gap-4 w-5/6 px-4 pb-4'>
                      <div className='fr-view tinyEditor text-dial-gray-dark'>
                        {data.play.playDescription && parse(data.play.playDescription?.description)}
                      </div>
                      <div className='flex flex-col gap-3'>
                        {
                          data.play.playMoves.map((move, i) =>
                            <PlayPreviewMove key={i} playSlug={data.play.slug} moveSlug={move.slug} moveName={move.name} />
                          )
                        }
                      </div>
                      {
                        data.play.buildingBlocks && data.play.buildingBlocks.length > 0 &&
                          <div className='flex flex-col gap-3 my-3'>
                            <div className='h4'>{format('building-block.header')}</div>
                            <div
                              className='text-sm'
                              dangerouslySetInnerHTML={{ __html: format('play.buildingBlocks.subtitle') }}
                            />
                            {
                              data.play.buildingBlocks.map((bb, i) =>
                                <BuildingBlockCard key={i} buildingBlock={bb} listType='list' />
                              )
                            }
                          </div>
                      }
                      {
                        data.play.products && data.play.products.length > 0 &&
                          <div className='flex flex-col gap-3 my-3'>
                            <div className='h4'>{format('product.header')}</div>
                            <div
                              className='text-sm'
                              dangerouslySetInnerHTML={{ __html: format('play.products.subtitle') }}
                            />
                            {
                              data.play.products.map((product, i) =>
                                <ProductCard key={i} product={product} listType='list' />
                              )
                            }
                          </div>
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

export default PlayPreview
