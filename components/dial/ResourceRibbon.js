const ResourceRibbon = () => {
  return (
    <div
      className='rounded-b-[64px] z-40 bg-cover'
      style={{
        backgroundImage: 'url("/ui/v1/research-header.svg")',
        backgroundPosition: 'top center',
        height: '300px'
      }}
    >
      <div style={{ height: '260px', paddingTop: '20px' }}>
        <div className='flex h-full items-center'>
          <div className='px-4 lg:px-8 xl:px-56 text-4xl'>
            Research can provide a path to progress and prosperity. We aim for ours to contribute to exactly that.
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceRibbon
