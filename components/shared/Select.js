import React, { useId } from 'react'
import dynamic from 'next/dynamic'
import ReactSelect, { components } from 'react-select'
import { HiOutlineSearch } from 'react-icons/hi'
import classNames from 'classnames'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncReactSelect = dynamic(() => import('react-select/async'), { ssr: false })

const Select = React.forwardRef(({
  name,
  value,
  options,
  onChange,
  onBlur,
  placeholder,
  async = false,
  isSearch = false,
  controlSize = null,
  isInvalid = false,
  className,
  ...otherProps
}, ref) => {
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
      outline: isFocused ? '2px solid #3F9EDD' : isInvalid ? '1px solid #e11d48' : '1px solid #323245',
      borderRadius: '0.375rem'
    }),
    control: (provided) => ({
      ...provided,
      width: controlSize,
      height: '44px',
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
      ...provided,
      zIndex: 30,
      color: 'red'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 30
    })
  }

  const SearchDropdownIndicator = props => (
    <components.DropdownIndicator {...props}>
      <HiOutlineSearch className='text-2xl'/>
    </components.DropdownIndicator>
  )

  const id = useId()

  return (
    async ? (
      <AsyncReactSelect
        {...otherProps}
        instanceId={id}
        inputId={`async-select-id-${name}`}
        innerRef={ref}
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        onBlur={onBlur}
        classNamePrefix='react-select'
        className={classNames(className)}
        styles={defaultStyles}
        components={isSearch && { DropdownIndicator: SearchDropdownIndicator }}
      />
    ) : (
      <ReactSelect
        {...otherProps}
        instanceId={id}
        inputId={`react-select-id-${name}`}
        innerRef={ref}
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        onBlur={onBlur}
        classNamePrefix='react-select'
        className={classNames(className)}
        styles={defaultStyles}
        components={isSearch && { DropdownIndicator: SearchDropdownIndicator }}
      />
    )
  )
})

Select.displayName = 'Select'

export default Select
