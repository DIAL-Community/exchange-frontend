import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { IoClose } from 'react-icons/io5'
import { useCallback, useContext } from 'react'
import { useUser } from '../../../../lib/hooks'
import { BOOKMARK_DETAIL_QUERY } from '../../shared/query/bookmark'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { DisplayType, ObjectType } from '../../utils/constants'
import ProductCard from '../../product/ProductCard'
import BuildingBlockCard from '../../building-block/BuildingBlockCard'
import UseCaseCard from '../../use-case/UseCaseCard'
import { REMOVE_BOOKMARK } from '../../shared/mutation/bookmark'
import { ToastContext } from '../../../../lib/ToastContext'
import { BookmarkDisplayContext } from './BookmarkDisplayContext'

const UrlCard = ({ url, dismissCardHandler }) => {
  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-product-bg-light to-product-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-meadow my-auto line-clamp-1'>
          {url}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <a href={url} target='_blank' rel='noreferrer'>
        {displaySmallCard()}
      </a>
      {dismissCardHandler && typeof dismissCardHandler === 'function' &&
        <button type='button' className='absolute p-2 top-0 right-0 text-dial-sapphire'>
          <IoClose size='1rem' className='text-dial-meadow' onClick={dismissCardHandler} />
        </button>
      }
    </div>
  )
}

const UserBookmarkRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    displayUseCases,
    displayProducts,
    displayBuildingBlocks,
    displayUrls
  } = useContext(BookmarkDisplayContext)

  const { user } = useUser()
  const { locale } = useRouter()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { loading, error, data } = useQuery(BOOKMARK_DETAIL_QUERY, {
    variables: { id: user?.id }
  })

  const [removeBookmark, { reset }] = useMutation(REMOVE_BOOKMARK, {
    onCompleted: (data) => {
      const { removeBookmark: response } = data
      if (response?.bookmark && response?.errors?.length === 0) {
        showSuccessMessage(format('toast.removeBookmark.success'))
      } else {
        showFailureMessage(format('toast.removeBookmark.failure'))
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.removeBookmark.failure'))
      reset()
    }
  })

  const unbookmarkThis = (object, objectType) => {
    if (user && object && objectType) {
      const { userEmail, userToken } = user
      removeBookmark({
        variables: {
          data: Object.prototype.hasOwnProperty.call(object, 'id') ? object.id : object,
          type: objectType
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.bookmark) {
    return <NotFound />
  }

  const { bookmark } = data

  return (
    <div className='flex flex-col gap-y-6 py-6'>
      {displayUseCases &&
        <div className='flex flex-col gap-y-4'>
          <div className='text-2xl font-semibold text-dial-blueberry'>
            {format('ui.useCase.header')}
          </div>
          <div className='text-sm text-dial-stratos'>
            {format('ui.bookmark.object.subtitle', { objects: format('ui.useCase.header') })}
          </div>
          <div className='grid lg:grid-cols-2 gap-x-8 gap-y-4'>
            {bookmark?.bookmarkedUseCases?.map((useCase, index) =>
              <div key={`use-case-${index}`}>
                <UseCaseCard
                  index={index}
                  useCase={useCase}
                  displayType={DisplayType.SMALL_CARD}
                  dismissCardHandler={() => unbookmarkThis(useCase, ObjectType.USE_CASE)}
                />
              </div>
            )}
          </div>
          <hr className='border-b border-slate-200 mt-4' />
        </div>
      }
      {displayBuildingBlocks &&
        <div className='flex flex-col gap-y-4'>
          <div className='text-2xl font-semibold text-dial-ochre'>
            {format('ui.buildingBlock.header')}
          </div>
          <div className='text-sm text-dial-stratos'>
            {format('ui.bookmark.object.subtitle', { objects: format('ui.buildingBlock.header') })}
          </div>
          <div className='grid lg:grid-cols-2 gap-x-8 gap-y-4'>
            {bookmark?.bookmarkedBuildingBlocks?.map((buildingBlock, index) =>
              <div key={`building-block-${index}`}>
                <BuildingBlockCard
                  index={index}
                  buildingBlock={buildingBlock}
                  displayType={DisplayType.SMALL_CARD}
                  dismissCardHandler={() => unbookmarkThis(buildingBlock, ObjectType.BUILDING_BLOCK)}
                />
              </div>
            )}
          </div>
          <hr className='border-b border-slate-200 mt-4' />
        </div>
      }
      {displayProducts &&
        <div className='flex flex-col gap-y-4'>
          <div className='text-2xl font-semibold text-dial-meadow'>
            {format('ui.product.header')}
          </div>
          <div className='text-sm text-dial-stratos'>
            {format('ui.bookmark.object.subtitle', { objects: format('ui.product.header') })}
          </div>
          <div className='grid lg:grid-cols-2 gap-x-8 gap-y-4'>
            {bookmark?.bookmarkedProducts?.map((product, index) =>
              <div key={`product-${index}`}>
                <ProductCard
                  index={index}
                  product={product}
                  displayType={DisplayType.SMALL_CARD}
                  dismissCardHandler={() => unbookmarkThis(product, ObjectType.PRODUCT)}
                />
              </div>
            )}
          </div>
          <hr className='border-b border-slate-200 mt-4' />
        </div>
      }
      {displayUrls &&
        <div className='flex flex-col gap-y-4'>
          <div className='text-2xl font-semibold text-dial-meadow'>
            {format('ui.url.header')}
          </div>
          <div className='text-sm text-dial-stratos'>
            {format('ui.bookmark.object.subtitle', { objects: format('ui.url.header') })}
          </div>
          <div className='grid gap-x-8 gap-y-4'>
            {bookmark?.bookmarkedUrls?.map((url, index) =>
              <div key={`url-${index}`}>
                <UrlCard
                  url={url}
                  dismissCardHandler={() => unbookmarkThis(url, ObjectType.URL)}
                />
              </div>
            )}
          </div>
          <hr className='border-b border-slate-200 mt-4' />
        </div>
      }
    </div>
  )
}

export default UserBookmarkRight
