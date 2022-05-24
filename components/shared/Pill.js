import { MdClose } from 'react-icons/md'
import classNames from 'classnames'

const Pill = ({ label, onRemove, className }) => (
  <div
    className={classNames(className, 'inline-flex items-center px-2 py-1 rounded-md bg-dial-blue-light text-lg text-dial-gray-dark')}
    data-testid='pill'
  >
    {label}
    <MdClose
      onClick={onRemove}
      className='ml-3 text-2xl cursor-pointer'
      data-testid='remove-button'
    />
  </div>
)

export default Pill
