import React, { useId } from 'react'
import dynamic from 'next/dynamic'
import ReactSelect, { components } from 'react-select'
import { HiOutlineSearch } from 'react-icons/hi'
import classNames from 'classnames'

// https://github.com/JedWatson/react-select/issues/3590
// Use property: menuIsOpen={true} to keep the select expanded

const AsyncReactSelect = dynamic(() => import('react-select/async'), { ssr: false })

const Select = React.forwardRef((
  {
    name,
    value,
    options,
    onChange,
    onBlur,
    placeholder,
    async = false,
    isSearch = false,
    isInvalid = false,
    isBorderless = false,
    isRibbonMenu = false,
    className,
    ...otherProps
  },
  ref
) => {
  const nonRibbonSelectHeight = isRibbonMenu ? { maxHeight: '30rem' } : { maxHeight: '16rem' }
  const defaultStyles = {
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#46465a',
      '&:hover': {
        color: '#46465a'
      }
    }),
    group: (provided) => ({
      ...provided,
      padding: 0
    }),
    groupHeading: (provided) => ({
      ...provided,
      margin: 0,
      color: '#000542',
      fontSize: '0.8rem',
      padding: '0.75rem 0.5rem 0.75rem 1rem',
      backgroundColor: '#ccd5e1',
      fontWeight: 600
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
      outline: isBorderless
        ? 'none'
        : isFocused
          ? '1px solid #2e3192'
          : isInvalid
            ? '1px solid #e11d48'
            : '1px solid #000542',
      borderRadius: '0.375rem'
    }),
    control: (provided) => ({
      ...provided,
      height: '2rem',
      boxShadow: 'none',
      cursor: 'pointer',
      borderRadius: '0.375rem',
      border: 0
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: isSelected ? '#2e3192' : isFocused && '#e6e9fc',
      color: isSelected ? 'white' : '#46465a'
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 30,
      color: 'red'
    }),
    menuList: (provided) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
      ...nonRibbonSelectHeight
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 30
    })
  }

  const SearchDropdownIndicator = props => (
    <components.DropdownIndicator {...props}>
      <HiOutlineSearch className='text-lg'/>
    </components.DropdownIndicator>
  )

  const id = useId()

  return (
    async
      ? <AsyncReactSelect
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
      : <ReactSelect
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
})

Select.displayName = 'Select'

export default Select
