import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const DigitalPrinciple = ({ principle, index }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-3 rounded-lg ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-10 h-10 block'>
          <img
            src={`/images/principles/${principle.slug}.png`}
            alt={format('ui.image.logoAlt', { name: format('ui.principle.label') })}
            className='object-contain w-10 h-10 mx-auto'
          />
        </div>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {principle.name}
        </div>
      </div>
    </div>

  return displayLargeCard()
}

export default DigitalPrinciple
