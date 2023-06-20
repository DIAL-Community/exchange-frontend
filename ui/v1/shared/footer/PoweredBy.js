const PoweredBy = () => {
  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        Powered by
      </div>
      <hr className='bg-dial-angel'/>
      <div className='flex gap-x-8'>
        <img
          src='/ui/v1/dial-logo.svg'
          alt='Logo of the Digital Impact Alliance.'
          width={96}
          className='object-contain'
        />
        <div className='text-sm text-dial-stratos'>
          The Digital Impact Exchange is a
          project of the Digital Impact Alliance
        </div>
      </div>
      <div className='flex gap-3 ml-auto pt-3'>
        <img
          src='/ui/v1/twitter-icon-wo-bg.svg'
          alt='Logo of twitter.'
          width={30}
          className='object-contain'
        />
        <img
          src='/ui/v1/linkedin-icon-wo-bg.svg'
          alt='Logo of linkedin.'
          width={30}
          className='object-contain'
        />
      </div>
    </div>
  )
}

export default PoweredBy
