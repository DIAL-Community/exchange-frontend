import classNames from 'classnames'

const Toggle = ({ displayed, label, checked, disabled, extraClassNames, onChange }) => {
  if (!displayed) return null

  return (
    <label className={`inline-flex items-center cursor-pointer ml-auto ${extraClassNames}`}>
      <input
        type='checkbox'
        value=''
        className='sr-only peer'
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <div className={classNames(
        'relative w-9 h-5 bg-gray-200 rounded-full',
        'peer peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600',
        'peer-checked:after:translate-x-full peer-checked:after:border-white',
        'after:content-[""] after:h-4 after:w-4 after:transition-all',
        'after:absolute after:top-[2px] after:start-[2px] after:bg-white',
        'after:border after:border-gray-300 after:rounded-full'
      )}>
      </div>
      <span className='ms-2 text-sm font-medium'>
        {label}
      </span>
    </label >
  )
}

export default Toggle
