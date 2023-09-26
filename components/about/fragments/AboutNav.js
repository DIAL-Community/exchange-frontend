import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'

const AboutNav = ({ scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const navOptions = [{
    label: format('ui.about.theExchange'),
    value: 'ui.about.theExchange'
  }, {
    label: format('ui.about.theVision'),
    value: 'ui.about.theVision'
  }, {
    label: format('ui.about.theBeyond'),
    value: 'ui.about.theBeyond'
  }, {
    label: format('ui.about.thePartner'),
    value: 'ui.about.thePartner'
  }, {
    label: format('ui.about.theTeam'),
    value: 'ui.about.theTeam'
  }]

  const onNavigationChange = (selectedNav) => {
    const { value } = selectedNav
    if (scrollRef && scrollRef.current) {
      const scrollTargetRef = scrollRef.current.find(ref => ref.value === value)
      scrollTargetRef?.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const fetchOptions = async (input) => {
    return navOptions.filter(({ label }) => label.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3 text-sm py-3'>
      <div className='font-semibold text-dial-sapphire'>
        {format('ui.shared.jumpTo')}
      </div>
      <Select
        async
        isBorderless
        aria-label={format('ui.ribbon.nav.ariaLabel')}
        cacheOptions
        defaultOptions={navOptions}
        loadOptions={fetchOptions}
        onChange={onNavigationChange}
        value={null}
      />
    </div>
  )
}

export default AboutNav
