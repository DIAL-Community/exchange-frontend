import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import { FiEdit3 } from 'react-icons/fi'

const EditButton = ({ type = 'button', onClick, href, className }) => {
  const innerHtml =
    <>
      <FiEdit3 className='inline pb-0.5' />
      <span className='text-sm px-1'>
        <FormattedMessage id='app.edit' />
      </span>
    </>

  const style = 'cursor-pointer bg-dial-iris-blue px-2 py-1 rounded text-white'

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

export default EditButton
