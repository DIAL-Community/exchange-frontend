const Share = () => {
  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        Share
      </div>
      <div className='flex flex-row gap-3'>
        <img
          src='/ui/v1/twitter-icon.svg'
          alt='Logo for sharing  the current page to twitter.'
          width={40}
          height={40}
          className='object-contain'
        />
        <img
          src='/ui/v1/linkedin-icon.svg'
          alt='Logo for sharing the current page to linkedin.'
          width={40}
          height={40}
          className='object-contain'
        />
        <img
          src='/ui/v1/email-icon.svg'
          alt='Logo for emailing the current page.'
          width={40}
          height={40}
          className='object-contain'
        />
        <img
          src='/ui/v1/copy-icon.svg'
          alt='Logo for copying url of the current page.'
          width={40}
          height={40}
          className='object-contain'
        />
      </div>
    </div>
  )
}

export default Share
