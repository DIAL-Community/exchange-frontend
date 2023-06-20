const Partner = () => {
  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        Our partners and supporters
      </div>
      <hr className='bg-dial-angel'/>
      <div className='flex gap-3 pt-3'>
        <img
          src='/ui/v1/unf-logo.svg'
          alt='Logo of UNF.'
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/bmgf-logo.svg'
          alt='Logo of BMGF.'
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/sida-logo.svg'
          alt='Logo of SIDA.'
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/ukaid-logo.svg'
          alt='Logo of UK Aid.'
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/giz-logo.svg'
          alt='Logo of GIZ.'
          width={100}
          className='object-contain'
        />
        <img
          src='/ui/v1/bmz-logo.svg'
          alt='Logo of BMZ.'
          width={100}
          className='object-contain'
        />
      </div>
    </div>
  )
}

export default Partner
