import { useIntl } from 'react-intl'

const WizardDescription = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className='relative w-full bg-gradient-to-r text-white from-dial-purple to-dial-purple-light'>
      <div className='max-w-3xl mx-auto py-12'>
        <div className='text-4xl font-semibold text-center'>
          {format('landing.wizard.whereToStart')}
        </div>
        <p className='mt-8 text-center'>
          {format('landing.wizard.description')}
        </p>
        <div className='text-center mt-12'>
          <a href='wizard' className='rounded-full shadow-2xl text-xl py-4 pl-4 pr-12 text-button-gray bg-dial-yellow'>
            <img src='/icons/wizard.svg' className='inline mx-2 pr-2' alt='Back' height='30px' width='30px' />
            {format('landing.wizard.buttonText')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default WizardDescription
