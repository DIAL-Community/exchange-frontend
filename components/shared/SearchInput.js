import { HiOutlineSearch } from 'react-icons/hi'
import { MdClose } from 'react-icons/md'
import classNames from 'classnames'

const EMPTY_VALUE = ''

export const SearchInput = ({
  value,
  placeholder,
  onChange,
  onBlur,
  onSearchIconClick = null,
  className,
  ...otherProps
}) => (
  <div className='flex items-center'>
    <input
      {...otherProps}
      type='text'
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={classNames(className, { 'pr-20': onSearchIconClick, 'pr-10': !onSearchIconClick }, 'w-full')}
      data-testid='search-input'
    />
    <div className={classNames({ '-ml-[4.5rem]': onSearchIconClick, '-ml-8': !onSearchIconClick }, 'flex mr-2')}>
      <span className='my-auto pr-1 bg-white text-2xl text-dial-gray-dark border-dial-gray-dark'>
        <MdClose
          data-testid='clear-icon-button'
          onClick={() => onChange({ target: { value: EMPTY_VALUE } })}
          className='cursor-pointer'
        />
      </span>
      {onSearchIconClick && (
        <span className='my-auto pl-1 border-l bg-white text-2xl text-dial-gray-dark border-dial-gray-dark'>
          <HiOutlineSearch
            data-testid='search-icon-button'
            onClick={onSearchIconClick}
            className='cursor-pointer'
          />
        </span>
      )}
    </div>
  </div>
)
