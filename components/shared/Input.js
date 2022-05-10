export const Input = ({ type = 'text', value, placeholder, onChange, onBlur, className = '', ...otherProps }) => (
  <input
    {...otherProps}
    type={type}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={placeholder}
    className={`${className} w-full`}
  />
)
