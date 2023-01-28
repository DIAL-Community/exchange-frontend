import classNames from 'classnames'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const WizardDescription = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  return (
    <div
      className={classNames(
        'relative w-full',
        'bg-gradient-to-r text-white from-dial-purple to-dial-purple-light',
        'max-w-catalog mx-auto'
      )}
    >
      <div className='max-w-4xl mx-auto py-12'>
        <div className='text-4xl font-semibold text-center px-2'>
          {format('landing.wizard.whereToStart')}
        </div>
        <p className='mt-8 text-center px-2'>
          {format('landing.wizard.description')}
        </p>
        <div className='text-center mt-12'>
          <Link href='/wizard'>
            <a
              className={`
                rounded-full shadow-2xl text-base md:text-xl py-4 pl-4 pr-12
                text-button-gray bg-dial-yellow intro-overview-wizard
              `}
            >
              <img src='/icons/wizard.svg' className='inline mx-2 pr-2' alt='Back' height='30px' width='30px' />
              {format('landing.wizard.buttonText')}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WizardDescription
