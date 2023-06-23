import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Select from '../../shared/form/Select'
import { REBRAND_BASE_PATH } from '../../utils/constants'

const UseCaseDetailNav = ({ scrollRef, useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  let stepNavOptions = []
  if (useCase.useCaseSteps) {
    stepNavOptions = useCase.useCaseSteps.map((useCaseStep, index) => {
      return {
        label: <div className='px-2'>{`${index + 1}. ${useCaseStep.name}`}</div>,
        value: `ui.useCase.detail.steps.${useCaseStep.slug}`
      }
    })
  }

  const navOptions = [{
    label: format('ui.useCase.detail.description'),
    value: 'ui.useCase.detail.description'
  }, {
    label: format('ui.useCase.detail.steps'),
    value: 'ui.useCase.detail.steps'
  }, ...stepNavOptions, {
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
    if (value.indexOf('ui.useCase.detail.steps.') >= 0) {
      const destinationSlug = value.replace('ui.useCase.detail.steps.', '')
      const destinationRoute = `${REBRAND_BASE_PATH}use-cases/${useCase.slug}/steps/${destinationSlug}`
      router.push(destinationRoute)
    } else if (scrollRef && scrollRef.current) {
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
