import classNames from 'classnames'
import { useSession } from 'next-auth/client'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import DeleteTag from './DeleteTag'

const TagCard = ({ tag, listType, displayEditButtons = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [ session ] = useSession()
  const { isAdminUser } = useUser(session)

  return (
    <>
      {listType === 'list'
        ? (
          <div
            className={classNames({ 'hover:border-dial-yellow hover:text-dial-yellow cursor-pointer': !displayEditButtons }, 'border-3 border-transparent text-button-gray')}
            data-testid='tag-card'
          >
            <div className='border border-dial-gray hover:border-transparent card-drop-shadow'>
              <div className='flex justify-between my-5 px-4'>
                <div className={classNames({ 'card-link-text': !displayEditButtons }, 'inline-block card-title text-button-gray')}>
                  {isAdminUser && displayEditButtons ? (
                    <span>{tag.name}</span>
                  ) : (
                    <span>{tag}</span>
                  )}
                </div>
                {isAdminUser && displayEditButtons && (
                  <div className='flex flex-row gap-3'>
                    <DeleteTag tag={tag} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        : <div>{format('tag.label')}</div>}
    </>
  )
}

export default TagCard
