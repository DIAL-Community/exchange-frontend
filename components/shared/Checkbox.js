export const Checkbox = ({ type, value, onChange, onBlur, className = '', ...otherProps }) => (
  <input
    {...otherProps}
    type='checkbox'
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    className={`${className} h-8 w-8`}
    data-testid='checkbox'
  />
)
