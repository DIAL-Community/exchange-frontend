import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { useUser } from '../../lib/hooks'

const RubricCategoryDetailLeft = ({ rubricCategory, slugNameMapping }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { user, isAdminUser } = useUser()

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/rubric_categories/${rubricCategory.slug}/edit`
  }

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-12 w-full'>
        {isAdminUser && <EditButton type='link' href={generateEditLink()}/>}
      </div>
      <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
        <div className='flex flex-col p-4 text-dial-gray-dark'>
          <div className='font-semibold text-lg'>
            {rubricCategory?.name}
          </div>
          <hr className='my-2' />
          <div className='text-sm'>
            <span className='font-semibold'>
              {format('rubric-category.weight')}
            </span>
            {`: ${rubricCategory?.weight}`}
          </div>
        </div>
      </div>
    </>
  )
}

export default RubricCategoryDetailLeft
