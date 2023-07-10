import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback, useContext } from 'react'
import { useUser } from '../../../../lib/hooks'
import { BOOKMARK_DETAIL_QUERY } from '../../shared/query/bookmark'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { DisplayType } from '../../utils/constants'
import ProductCard from '../../product/ProductCard'
import BuildingBlockCard from '../../building-block/BuildingBlockCard'
import UseCaseCard from '../../use-case/UseCaseCard'
import { BookmarkDisplayContext } from './BookmarkDisplayContext'

const UserBookmarkRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { displayUseCases, displayProducts, displayBuildingBlocks } = useContext(BookmarkDisplayContext)

  const { user } = useUser()
  const { loading, error, data } = useQuery(BOOKMARK_DETAIL_QUERY, {
    variables: { id: user?.id }
  })

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
          <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
            {bookmark?.bookmarkedUseCases?.map((useCase, index) =>
              <div key={`use-case-${index}`}>
                <UseCaseCard
                  index={index}
                  useCase={useCase}
                  displayType={DisplayType.SMALL_CARD}
                />
              </div>
            )}
          </div>
          <hr className='bg-slate-200 mt-4' />
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
          <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
            {bookmark?.bookmarkedBuildingBlocks?.map((buildingBlock, index) =>
              <div key={`building-block-${index}`}>
                <BuildingBlockCard
                  index={index}
                  buildingBlock={buildingBlock}
                  displayType={DisplayType.SMALL_CARD}
                />
              </div>
            )}
          </div>
          <hr className='bg-slate-200 mt-4' />
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
          <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
            {bookmark?.bookmarkedProducts?.map((product, index) =>
              <div key={`product-${index}`}>
                <ProductCard
                  index={index}
                  product={product}
                  displayType={DisplayType.SMALL_CARD}
                />
              </div>
            )}
          </div>
          <hr className='bg-slate-200 mt-4' />
        </div>
      }
    </div>
  )
}

export default UserBookmarkRight
