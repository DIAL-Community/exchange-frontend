const Comment = () => {
  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        Post a comment
      </div>
      <div className='text-sm text-dial-stratos'>
        Have a question for the community on this
        Use case or have some insight you would like to share?
      </div>
      <div className='flex text-white'>
        <div className='bg-dial-iris-blue rounded-md text-sm'>
          <div className='px-5 py-3'>
            Post a comment
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comment
