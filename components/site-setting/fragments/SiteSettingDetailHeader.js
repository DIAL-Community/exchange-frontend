const SiteSettingDetailHeader = ({ siteSetting }) => {
  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl font-semibold'>
        {siteSetting.name}
      </div>
    </div>
  )
}

export default SiteSettingDetailHeader
