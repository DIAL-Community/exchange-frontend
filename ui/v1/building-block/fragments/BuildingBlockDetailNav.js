import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Select from '../../shared/form/Select'
import { REBRAND_BASE_PATH } from '../../utils/constants'

const BuildingBlockDetailNav = ({ scrollRef, buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  let stepNavOptions = []
  if (buildingBlock.buildingBlockSteps) {
    stepNavOptions = buildingBlock.buildingBlockSteps.map((buildingBlockStep, index) => {
      return {
        label: <div className='px-2'>{`${index + 1}. ${buildingBlockStep.name}`}</div>,
        value: `ui.buildingBlock.detail.steps.${buildingBlockStep.slug}`
      }
    })
  }

  const navOptions = [{
    label: format('ui.common.detail.description'),
    value: 'ui.common.detail.description'
  }, {
    label: format('ui.buildingBlock.detail.steps'),
    value: 'ui.buildingBlock.detail.steps'
  }, ...stepNavOptions, {
    label: format('ui.workflow.header'),
    value: 'ui.workflow.header'
  }, {
    label: format('ui.sdgTarget.header'),
    value: 'ui.sdgTarget.header'
  }, {
    label: format('ui.buildingBlock.header'),
    value: 'ui.buildingBlock.header'
  }, {
    label: format('ui.tag.header'),
    value: 'ui.tag.header'
  }]

  const onNavigationChange = (selectedNav) => {
    const { value } = selectedNav
    if (value.indexOf('ui.buildingBlock.detail.steps.') >= 0) {
      const destinationSlug = value.replace('ui.buildingBlock.detail.steps.', '')
      const destinationRoute =
        `${REBRAND_BASE_PATH}` +
        `/building-blocks/${buildingBlock.slug}` +
        `/building-block-steps/${destinationSlug}`
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
      <div className='font-semibold text-dial-ochre'>
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

export default BuildingBlockDetailNav
