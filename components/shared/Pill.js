import classNames from 'classnames'
import { IoClose } from 'react-icons/io5'

const Pill = ({ label, onRemove, className, readOnly = false }) => (
  <div
    className={classNames(
      className,
      'shadow-md flex gap-2 px-2 py-1 bg-white text-dial-stratos'
    )}
    data-testid='pill'
  >
    {label}
    {!readOnly &&
      <IoClose
        onClick={onRemove}
        className='cursor-pointer opacity-50'
        size='1.5em'
        data-testid='remove-button'
      />
    }
  </div>
)

export default Pill
