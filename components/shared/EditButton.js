import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'

const EditButton = ({ type = 'button', onClick, href, className }) => {
  const innerHtml =
    <>
      <img
        src='/icons/edit.svg'
        alt='Edit'
        height='12px'
        width='12px'
      />
      <span className='text-sm'>
        <FormattedMessage id='app.edit' />
      </span>
    </>

  const style = 'flex items-center gap-x-1.5 bg-dial-iris-blue px-2 py-1 rounded-md text-white'

  return (
    type === 'button' ? (
      <button
        type='button'
        onClick={onClick}
        className={classNames(className, style)}
        data-testid='edit-button'
      >
        {innerHtml}
      </button>
    ) : type === 'link' && (
      <a
        href={href}
        className={classNames(className, style)}
        data-testid='edit-link'
      >
        {innerHtml}
      </a>
    )
  )
}

export default EditButton
