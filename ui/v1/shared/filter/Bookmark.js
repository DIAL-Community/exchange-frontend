const Bookmark = () => {
  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        Bookmark
      </div>
      <div className='flex flex-row gap-x-3'>
        <img
          src='/ui/v1/bookmark-icon.svg'
          alt='Logo for bookmarking the current page.'
          width={40}
          height={40}
          className='object-contain'
        />
        <div className='text-sm my-auto'>
          Bookmark this page
        </div>
      </div>
      <div className='text-sm text-dial-stratos'>
        Your bookmarks can be found in your Account page
      </div>
    </div>
  )
}

export default Bookmark
