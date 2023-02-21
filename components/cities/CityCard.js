const CityCard = ({ city, listType }) => {
  return (
    <>
      {
        listType === 'list' &&
          (
            <div className='border-3 border-transparent'>
              <div className='border border-dial-gray card-drop-shadow'>
                <div className='my-4 px-4'>
                  <div className='pr-3 font-semibold line-clamp-1 text-button-gray'>
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
