import classNames from 'classnames'

const IconButton = ({ icon, onClick, className, ...otherProps }) => (
  <button
    {...otherProps}
    type='button'
    className={classNames(className, 'shadow-md p-3 bg-dial-sapphire hover:bg-dial-angel')}
    onClick={onClick}
    data-testid='icon-button'
  >
    {icon}
  </button>
)

export default IconButton
