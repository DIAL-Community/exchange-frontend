import { HiOutlineSearch } from 'react-icons/hi'
import { MdClose } from 'react-icons/md'

const EMPTY_VALUE = ''

export const SearchInput = ({ value, placeholder, onChange, onBlur, onSearchIconClick = null, className = '', ...otherProps }) => (
  <div className='flex items-center'>
    <input
      {...otherProps}
      type='text'
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`${className} w-full ${onSearchIconClick ? 'pr-20' : 'pr-10'}`}
      data-testid='search-input'
    />
    <div className={`${onSearchIconClick ? '-ml-[4.5rem]' : '-ml-8'} flex`}>
      <span className='my-auto pr-1 bg-white text-2xl text-dial-gray-dark border-dial-gray-dark'>
        <MdClose
          data-testid='clear-icon-button'
          onClick={() => onChange({ target: { value: EMPTY_VALUE }})}
          className='cursor-pointer'
        />
      </span>
      {onSearchIconClick && (
        <span className='my-auto pl-1 border-l bg-white text-3xl text-dial-gray-dark border-dial-gray-dark'>
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
