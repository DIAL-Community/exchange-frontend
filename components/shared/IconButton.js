export const IconButton = ({ icon, onClick, className = '', ...otherProps }) => (
  <button
    {...otherProps}
    type='button'
    className={`${className} shadow-md p-3 bg-dial-blue hover:bg-dial-blue-light`}
    onClick={onClick}
    data-testid='icon-button'
  >
    {icon}
  </button>
)
