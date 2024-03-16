const DpiCountryDetail = ({ country }) => {
  return (
    <div className='flex flex-col gap-5'>
      <div className='text-lg font-semibold'>
        {country.name}
      </div>
      <div className='grid grid-cols-3 gap-3'>
        {country.organizations.map((organization, index) => {
          return (
            <div className='p-4 border rounded" key={index}>
              <div className='line-clamp-1 overflow-auto'>
                {organization.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DpiCountryDetail
