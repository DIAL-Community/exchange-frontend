import { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { SiteSettingContext, SiteSettingDispatchContext } from '../context/SiteSettingContext'
import Toggle from './form/Toggle'

const HidableSection = ({ objectType, objectKey, displayed, disabled }) => {
  const { sectionConfigurations } = useContext(SiteSettingContext)
  const { setSectionConfigurations } = useContext(SiteSettingDispatchContext)

  const toggleDisplay = () => {
    const currentSections = sectionConfigurations[objectType] ?? []
    const keyIndex = currentSections.indexOf(objectKey)
    if (keyIndex === -1) {
      setSectionConfigurations({
        ...sectionConfigurations,
        [objectType]: [...currentSections, objectKey]
      })
    } else {
      setSectionConfigurations({
        ...sectionConfigurations,
        [objectType]: [...currentSections.filter((currentKey) => currentKey !== objectKey)]
      })
    }
  }

  const sectionChecked = () => {
    const currentSections = sectionConfigurations[objectType] ?? []

    return currentSections.indexOf(objectKey) !== -1
  }

  return (
    <Toggle
      extraClassNames={`text-dial-stratos ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled}
      displayed={displayed}
      checked={sectionChecked()}
      label={<FormattedMessage id='app.hide' />}
      onChange={toggleDisplay}
    />
  )
}

export default HidableSection
