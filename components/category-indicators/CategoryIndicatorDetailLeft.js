import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import DeleteCategoryIndicator from './DeleteCategoryIndicator'

const CategoryIndicatorDetailLeft = ({ categoryIndicator, slugNameMapping }) => {
  const { formatMessage } = useIntl()
  const { query: { slug } } = useRouter()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-12 w-full inline-flex gap-3 items-center'>
        <DeleteCategoryIndicator categoryIndicator={categoryIndicator} />
        <EditButton type='link' href={`/rubric_categories/${slug}/${categoryIndicator.slug}/edit`}/>
      </div>
      <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
        <div className='flex flex-col p-4 text-dial-gray-dark'>
          <div className='font-semibold text-lg'>
            {categoryIndicator?.name}
          </div>
          <hr className='my-2' />
          <div className='text-sm'>
            <div>
              <span className='font-semibold'>
                {formatMessage({ id: 'categoryIndicator.weight' })}
              </span>
              : {categoryIndicator?.weight}
            </div>
            <div>
              <span className='font-semibold'>
                {formatMessage({ id: 'categoryIndicator.indicatorType' })}
              </span>
              : {categoryIndicator?.indicatorType}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryIndicatorDetailLeft
