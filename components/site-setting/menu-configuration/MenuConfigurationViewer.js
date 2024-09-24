const MenuConfigurationViewer = ({ menuConfiguration }) => {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-1'>
        <div className='font-semibold'>
          {menuConfiguration.name}
        </div>
      </div>
    </div>
  )
}

export default MenuConfigurationViewer
