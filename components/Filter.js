const Filter = () => (
  <nav className='sticky flex items-center justify-between flex-wrap bg-dial-gray-light p-6 w-full pb-2' style={{ top: '60px' }}>
    <div className='flex cursor-pointer'>
      <div className='my-2 mx-6 py-2 px-6 rounded-lg text-dial-blue-darkest bg-dial-gray'>SDGs</div>
      <div className='my-2 mx-6 py-2 px-6 rounded-lg text-dial-blue-darkest bg-dial-gray'>Use Cases</div>
      <div className='my-2 mx-6 py-2 px-6 rounded-lg text-dial-blue-darkest bg-dial-gray'>Workflows</div>
      <div className='my-2 mx-6 py-2 px-6 rounded-lg text-dial-blue-darkest bg-dial-gray'>Building Blocks</div>
      <div className='my-2 mx-6 py-2 px-6 rounded-lg text-dial-blue-light bg-dial-gray-dark'>Products</div>
      <div className='my-2 mx-6 py-2 px-6 rounded-lg text-dial-blue-darkest bg-dial-gray'>Projects</div>
      <div className='my-2 mx-6 py-2 px-6 rounded-lg text-dial-blue-darkest bg-dial-gray'>Organizations</div>
    </div>
  </nav>
)

export default Filter
