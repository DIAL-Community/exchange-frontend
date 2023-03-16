import { MdClose } from 'react-icons/md'
import classNames from 'classnames'

const Pill = ({ label, onRemove, className, readOnly = false }) => (
  <div
    className={classNames(
      className,
      'inline-flex items-center px-2 py-1 rounded-md bg-dial-blue-light',
      'text-dial-gray-dark'
    )}
    data-testid='pill'
  >
    {label}
    {!readOnly &&
      <MdClose
        onClick={onRemove}
        className='ml-3 text-2xl cursor-pointer'
        data-testid='remove-button'
      />
    }
  </div>
)

export default Pill
