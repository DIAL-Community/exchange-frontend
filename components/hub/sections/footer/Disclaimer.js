import { useCallback, useState } from 'react'
import { FaLinkedin } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import ReportIssue from '../../../shared/ReportIssue'

const Disclaimer = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showForm, setShowForm] = useState(false)
  const [formTitle, setFormTitle] = useState('')

  const showReportIssueForm = () => {
    setShowForm(true)
    setFormTitle('app.reportIssue')
  }

  return (
    <div className='flex flex-col gap-y-2 py-3'>
      <div className='flex flex-row'>
        <div className='flex gap-2 ml-auto'>
          <a
            href='//www.linkedin.com/company/digital-impact-alliance/'
            target='_blank'
            rel='noreferrer'
          >
            <FaLinkedin size='2rem' className='text-dial-cotton'/>
          </a>
        </div>
      </div>
      <a
        href='/privacy-policy'
        target='_blank'
        rel='noreferrer'
        className='ml-auto'
      >
        <div className='text-sm text-dial-cotton'>
          {format('ui.footer.disclaimer.privacyPolicy')}
        </div>
      </a>
      <div className='ml-auto text-sm text-dial-cotton'>
        {format('ui.footer.disclaimer.copyright', { year: new Date().getFullYear() })}
      </div>
      <button className='ml-auto text-sm text-dial-cotton' onClick={() => showReportIssueForm()}>
        <div className='border-b border-transparent hover:border-dial-yellow'>{format('app.reportIssue')}</div>
      </button>
      {showForm &&
        <ReportIssue
          showForm={showForm}
          hideFeedbackForm={() => setShowForm(false)}
          formTitle={format(formTitle)}
        />
      }
    </div>
  )
}

export default Disclaimer
