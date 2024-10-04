import SiteSettingListLeft from './fragments/SiteSettingListLeft'
import SiteSettingSimpleLeft from './fragments/SiteSettingSimpleLeft'

const SiteSettingMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <SiteSettingListLeft /> }
      { activeTab === 1 && <SiteSettingSimpleLeft />}
      { activeTab === 2 && <SiteSettingSimpleLeft /> }
    </>
  )
}

export default SiteSettingMainLeft
