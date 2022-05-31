const Landing = () => {
  return (
    <div className='relative overflow-hidden landing-with-menu'>
      <div className='max-w-catalog mx-auto'>
        <img src='images/gosl/GoSL.png' alt='Government of Sierra Leone' height='400' width='400' className='m-12' />
      </div>
      <div className="absolute flex pl-5 pb-12 pt-20">
        <div className="block text-white">
          <div className="content-limiter">
            <div className='text-4xl font-bold my-5'>Accelerating the digital transformation of government services</div>
            <p className='w-1/2 text-2xl mt-4'>Our vision is that in five years, we can empower governments to take ownership of their digital futures by building more effective and cost-efficient digital government services.</p>
          </div>
        </div>
      </div> 
      <button className="text-white scroll-button"><span className="hidden">Scroll Down</span>
        <svg width="32" height="33" viewBox="0 0 32 33" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M.746 16.079l1.386-1.415a.828.828 0 011.188 0l10.86 11.081V1.357c0-.473.376-.857.84-.857h1.96c.464 0 .84.384.84.857v24.388l10.86-11.08a.828.828 0 011.188 0l1.386 1.414a.87.87 0 010 1.212l-14.66 14.958a.828.828 0 01-1.188 0L.746 17.291a.87.87 0 010-1.212z" fill="currentColor"></path></svg> 
      </button>
    </div>
  )
}

export default Landing