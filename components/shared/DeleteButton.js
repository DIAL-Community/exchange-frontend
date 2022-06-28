import { BsTrash } from 'react-icons/bs'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

const DeleteButton = ({ type = 'button', onClick, href, className }) => {
  const innerHtml =
    <>
      <BsTrash className='text-sm'/>
      <span className='text-sm'>
        <FormattedMessage id='app.delete' />
      </span>
    </>

  const style = 'delete-button gap-x-1.5'

  return (
    type === 'button' ? (
      <button
        type='button'
        onClick={onClick}
        className={classNames(className, style)}
        data-testid='delete-button'
      >
        {innerHtml}
      </button>
    ) : type === 'link' && (
      <a
        href={href}
        className={classNames(className, style)}
        data-testid='delete-link'
      >
        {innerHtml}
      </a>
    )
  )
}

export default DeleteButton
