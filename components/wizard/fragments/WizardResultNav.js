import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'
import WizardSupportDialog from './WizardSupportDialog'

const WizardResultNav = ({ scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [supportDialogOpen, setSupportDialogOpen] = useState(false)

  const navOptions = [{
    label: format('ui.useCase.header'),
    value: 'ui.useCase.header'
  }, {
    label: format('ui.product.header'),
    value: 'ui.product.header'
  },{
    label: format('ui.buildingBlock.header'),
    value: 'ui.buildingBlock.header'
  },  {
    label: format('ui.project.header'),
    value: 'ui.project.header'
  }, {
    label: format('ui.dataset.header'),
    value: 'ui.dataset.header'
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
    return navOptions.filter(({ label }) =>
      label.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3 text-sm py-3'>
      <div className='font-semibold text-dial-iris-blue'>
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
      <div className='flex text-sm text-white mt-3 mb-6'>
        <button onClick={() => setSupportDialogOpen(true)}>
          <div className='px-5 py-2 rounded-md bg-dial-iris-blue'>
            {format('wizard.additionalSupport')}
          </div>
        </button>
      </div>
      <WizardSupportDialog
        isOpen={supportDialogOpen}
        onClose={() => setSupportDialogOpen(false)}
      />
    </div>
  )

}

export default WizardResultNav
