const TagDetailHeader = ({ tag }) => {

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {tag.name}
      </div>
    </div>
  )
}

export default TagDetailHeader
