import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { useUser } from '../../lib/hooks'
import DeleteRubricCategory from './DeleteRubricCategory'

const RubricCategoryDetailLeft = ({ rubricCategory, slugNameMapping }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { isAdminUser } = useUser()

  const generateEditLink = () => {
    if (!isAdminUser) {
      return '/edit-not-available'
    }

    return `/rubric_categories/${rubricCategory.slug}/edit`
  }

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-12 w-full inline-flex gap-3 items-center'>
        {isAdminUser && <DeleteRubricCategory rubricCategory={rubricCategory} />}
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
              {format('ui.rubricCategory.weight')}
            </span>
            {`: ${rubricCategory?.weight}`}
          </div>
        </div>
      </div>
    </>
  )
}

export default RubricCategoryDetailLeft
