import { MdClose } from 'react-icons/md'

export const SearchInput = ({ value, placeholder, onChange }) => (
  <label htmlFor='search-bar' className='relative'>
    <input
      id='search-bar'
      type='text'
      className='w-full border text-sm'
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
    <MdClose
      onClick={() => onChange({ target: { value: '' } })}
      className='absolute top-1/2 transform -translate-y-1/2 right-2'
    />
  </label>
)
