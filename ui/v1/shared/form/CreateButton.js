import classNames from 'classnames'
import { FiPlusCircle } from 'react-icons/fi'

const CreateButton = ({
  type = 'button',
  label,
  onClick,
  href,
  className
}) => {
  const innerHtml =
    <>
      <FiPlusCircle className='inline pb-0.5' />
      <span className='text-sm px-1'>
        {label}
      </span>
    </>

  const style = 'cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-white'

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
