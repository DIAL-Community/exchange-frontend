import classNames from 'classnames'
import { FaXmark } from 'react-icons/fa6'

const Pill = ({ label, onRemove, className, readOnly = false }) => (
  <div
    className={classNames(
      className,
      'shadow-md flex gap-x-2 px-2 py-1 bg-white text-dial-stratos'
    )}
  >
    <div className='line-clamp-1'>{label}</div>
    {!readOnly &&
      <button type='button' onClick={onRemove}>
        <FaXmark className='text-dial-stratos' size='1rem' />
      </button>
    }
  </div>
)

export default Pill
