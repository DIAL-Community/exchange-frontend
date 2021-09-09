const CityCard = ({ city, listType }) => {
  return (
    <>
      {
        listType === 'list' &&
          (
            <div className='border-3 border-transparent hover:border-dial-yellow hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='my-4 px-4'>
                  <div className='pr-3 text-base font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden text-button-gray'>
                    {city.name}
                  </div>
                </div>
              </div>
            </div>
          )
      }
    </>
  )
}

export default CityCard
