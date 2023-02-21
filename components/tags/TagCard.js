import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import parse from 'html-react-parser'
import classNames from 'classnames'
import { useUser } from '../../lib/hooks'
import EditButton from '../shared/EditButton'
import DeleteTag from './DeleteTag'
import TagForm from './TagForm'

const TagCard = ({ tag, listType, displayEditButtons = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser } = useUser()

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)

  const toggleFormDialog = () => setIsFormDialogOpen(!isFormDialogOpen)

  return (
    <>
      {listType === 'list'
        ? (
          <div
            className='border-3 border-transparent text-button-gray'
            data-testid='tag-card'
          >
            <div className='border border-dial-gray card-drop-shadow'>
              <div className='flex gap-3 my-5 px-4'>
                <div className={classNames('card-title text-button-gray', { 'w-2/6': displayEditButtons })}>
                  {isAdminUser && displayEditButtons ? (
                    <span>{tag.name}</span>
                  ) : (
                    <span>{tag}</span>
                  )}
                </div>
                <div className={classNames('line-clamp-1', { 'w-1/3': tag.tagDescription })}>
                  {tag.tagDescription && parse(tag.tagDescription.description)}
                </div>
                {isAdminUser && displayEditButtons && (
                  <div className='flex flex-row gap-3 ml-auto'>
                    <EditButton onClick={toggleFormDialog}/>
                    <DeleteTag tag={tag} />
                  </div>
                )}
              </div>
            </div>
            <TagForm tag={tag} isOpen={isFormDialogOpen} onClose={toggleFormDialog} />
          </div>
        )
        : <div>{format('tag.label')}</div>}
    </>
  )
}

export default TagCard
