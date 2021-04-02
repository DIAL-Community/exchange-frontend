import { useIntl } from 'react-intl'

const WizardDescription = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className='relative w-full bg-gradient-to-r text-white from-dial-purple to-dial-purple-light'>
      <div className='max-w-3xl mx-auto py-12'>
        <div className='text-5xl font-semibold tracking-wide text-center'>
          {format('landing.wizard.whereToStart')}
        </div>
        <p className='mt-8 text-center leading-loose'>
          {format('landing.wizard.description')}
        </p>
        <div className='text-center mt-12'>
          <a href='wizard' className='border border-white rounded shadow-2xl text-2xl py-4 px-12 text-gray-800 bg-dial-yellow'>
            {format('landing.wizard.buttonText')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default WizardDescription
