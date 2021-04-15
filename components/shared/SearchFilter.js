const SearchFilter = (props) => {
  const { search, setSearch, displayType, setDisplayType, componentName } = props
  const handleChange = (e) => setSearch(e.target.value)
  const toggleDisplayType = (e) => {
    e.preventDefault()
    setDisplayType(displayType === 'list' ? 'card' : 'list')
  }

  return (
    <div className='relative mx-2 grid grid-cols-12 gap-4 bg-transparent'>
      <div className='col-span-12 md:col-span-6'>
        <div className='flex flex-row'>
          <label className='block w-8/12 mt-4'>
            <span className='sr-only'>Name</span>
            <input
              value={search} onChange={handleChange}
              className='form-input text-base py-3 px-4 w-full rounded-md border'
              placeholder={`Search for a ${componentName}`}
            />
          </label>
          <div className='w-4/12 mt-4'>
            <div className='my-auto py-3 px-4 flex flex-row'>
              <div className='text-base text-dial-gray-dark font-semibold px-4 my-auto opacity-70'>Switch View</div>
              {
                displayType === 'card' &&
                  <>
                    <img className='mr-2 h-8' src='/icons/card-active/card-active.png' />
                    <a href='toggle-display' onClick={toggleDisplayType}>
                      <img className='mr-2 h-8 cursor-pointer' src='/icons/list-inactive/list-inactive.png' />
                    </a>
                  </>
              }
              {
                displayType === 'list' &&
                  <>
                    <a href='toggle-display' onClick={toggleDisplayType}>
                      <img className='mr-2 h-8 cursor-pointer' src='/icons/card-inactive/card-inactive.png' />
                    </a>
                    <img className='mr-2 h-8' src='/icons/list-active/list-active.png' />
                  </>
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SearchFilter
