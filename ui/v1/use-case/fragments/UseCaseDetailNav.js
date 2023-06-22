import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'

const UseCaseDetailNav = ({ scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const navOptions = [{
    label: format('ui.useCase.detail.description'),
    value: 'ui.useCase.detail.description'
  }, {
    label: format('ui.useCase.detail.steps'),
    value: 'ui.useCase.detail.steps'
  }, {
    label: format('ui.useCase.detail.workflows'),
    value: 'ui.useCase.detail.workflows'
  }, {
    label: format('ui.useCase.detail.sdgTargets'),
    value: 'ui.useCase.detail.sdgTargets'
  }, {
    label: format('ui.useCase.detail.buildingBlocks'),
    value: 'ui.useCase.detail.buildingBlocks'
  }, {
    label: format('ui.useCase.detail.tags'),
    value: 'ui.useCase.detail.tags'
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
    return navOptions.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3 text-sm'>
      <div className='font-semibold text-dial-blueberry'>
        {format('ui.shared.jumpTo')}
      </div>
      <Select
        async
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

export default UseCaseDetailNav
