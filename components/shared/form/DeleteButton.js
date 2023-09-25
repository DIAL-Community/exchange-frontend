import { FaRegTrashCan } from 'react-icons/fa6'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

const DeleteButton = ({ type = 'button', title = 'app.delete', onClick, href, className }) => {
  const innerHtml =
    <>
      <FaRegTrashCan className='text-sm'/>
      <span className='text-sm'>
        <FormattedMessage id={title} />
      </span>
    </>

  const style = 'delete-button gap-x-1.5'

  return (
    type === 'button'
      ? (
        <button type='button' onClick={onClick} className={classNames(className, style)}>
          {innerHtml}
        </button>
      )
      : type === 'link' && (
        <a href={href} className={classNames(className, style)}>
          {innerHtml}
        </a>
      )
  )
}

export default DeleteButton
