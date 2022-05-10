import dynamic from 'next/dynamic'
import ReactSelect from 'react-select'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncReactSelect = dynamic(() => import('react-select/async'), { ssr: false })

export const Select = ({ value, options, onChange, onBlur, placeholder, async = false, controlSize = null, ...otherProps }) => {
  const defaultStyles = {
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#46465a',
      '&:hover': {
        color: '#46465a'
      }
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#46465a'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#dfdfea'
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '.25rem 0 .25rem .75rem'
    }),
    container: (provided, { isFocused }) => ({
      ...provided,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      outline: isFocused ? '3px solid #3F9EDD' : '1px solid #323245',
      borderRadius: '0.375rem'
    }),
    control: (provided) => ({
      ...provided,
      width: controlSize ,
      boxShadow: 'none',
      cursor: 'pointer',
      borderRadius: '0.375rem',
      border: 0
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: isSelected ? '#3F9EDD' : isFocused && '#b2daf5',
      color: isSelected ? 'white' : '#46465a' 
    }),
    menuPortal: (provided) => ({
      ...provided, zIndex: 30,
      color: 'red'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 30
    })
  }
  
  return (
    async ? (
      <AsyncReactSelect
        {...otherProps}
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        onBlur={onBlur}
        classNamePrefix='react-select'
        styles={defaultStyles}
      />
    ) : (
      <ReactSelect
        {...otherProps}
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        onBlur={onBlur}
        classNamePrefix='react-select'
        styles={defaultStyles}
      />
    )
  )
}
