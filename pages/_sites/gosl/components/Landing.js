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
      
    </div>
  )
}

export default Landing