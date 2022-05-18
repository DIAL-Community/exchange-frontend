import { FormattedMessage } from 'react-intl'

const EditButton = ({ type = 'button', onClick, href, className = '' }) => {
  const innerHtml =
    <>
      <img
        src='/icons/edit.svg'
        className=''
        alt='Edit'
        height='12px'
        width='12px'
      />
      <span className='text-sm'>
        <FormattedMessage id='app.edit' />
      </span>
    </>

  return (
    type === 'button' ? (
      <button
        type='button'
        onClick={onClick}
        className={`${className} inline-flex items-center gap-x-1.5 bg-dial-blue px-2 py-1 text-white`}
        data-testid='edit-button'
      >
        {innerHtml}
      </button>
    ) : type === 'link' && (
      <a
        href={href}
        className={`${className} inline-flex items-center gap-x-1.5 bg-dial-blue px-2 py-1 rounded-md text-white`}
        data-testid='edit-link'
      >
        {innerHtml}
      </a>
    )
  )
}

export default EditButton
