import classNames from 'classnames'
import { IoClose } from 'react-icons/io5'

const Pill = ({ label, onRemove, className, readOnly = false }) => (
  <div
    className={classNames(
      className,
      'shadow-md flex gap-x-2 px-2 py-1 bg-white text-dial-stratos'
    )}
  >
    <div className='line-clamp-1'>{label}</div>
    {!readOnly &&
      <button onClick={onRemove}>
        <IoClose size='1rem' />
      </button>
    }
  </div>
)

export default Pill
