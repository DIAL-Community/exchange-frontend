const TenantSettingDetailHeader = ({ tenantSetting }) => {
  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl font-semibold'>
        {tenantSetting.tenantName}
      </div>
    </div>
  )
}

export default TenantSettingDetailHeader
