import classNames from 'classnames'

const IconButton = ({ icon, onClick, className, ...otherProps }) => (
  <button
    {...otherProps}
    type='button'
    className={classNames(className, 'shadow-md px-3 py-2.5 hover:bg-dial-angel')}
    onClick={onClick}
  >
    {icon}
  </button>
)

export default IconButton
