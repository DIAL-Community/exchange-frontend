import classNames from 'classnames'
import { FiPlusCircle } from 'react-icons/fi'

const CreateButton = ({
  type = 'button',
  href,
  label,
  onClick,
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
      >
        {innerHtml}
      </button>
    ) : type === 'link' && (
      <a
        href={href}
        className={classNames(className, style)}
      >
        {innerHtml}
      </a>
    )
  )
}

export default CreateButton
