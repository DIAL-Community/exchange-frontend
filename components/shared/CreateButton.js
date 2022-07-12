import classNames from 'classnames'

const CreateButton = ({
  type = 'button',
  label,
  onClick,
  href,
  className
}) => {
  const innerHtml =
    <>
      <img
        src='/icons/edit.svg'
        alt='Edit'
        height='12px'
        width='12px'
      />
      <span className='text-sm'>
        {label}
      </span>
    </>

  const style = 'create-button gap-x-1.5'

  return (
    type === 'button' ? (
      <button
        type='button'
        onClick={onClick}
        className={classNames(className, style)}
        data-testid='create-button'
      >
        {innerHtml}
      </button>
    ) : type === 'link' && (
      <a
        href={href}
        className={classNames(className, style)}
        data-testid='create-link'
      >
        {innerHtml}
      </a>
    )
  )
}

export default CreateButton
