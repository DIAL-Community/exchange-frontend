import TenantSettingListLeft from './fragments/TenantSettingListLeft'
import TenantSettingSimpleLeft from './fragments/TenantSettingSimpleLeft'

const TenantSettingMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <TenantSettingListLeft /> }
      { activeTab === 1 && <TenantSettingSimpleLeft />}
      { activeTab === 2 && <TenantSettingSimpleLeft /> }
    </>
  )
}

export default TenantSettingMainLeft
