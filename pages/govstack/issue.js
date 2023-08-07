import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import Header from '../../components/govstack/Header'
import { ToastContext } from '../../lib/ToastContext'

const GovStackIssueForm = ({ referer }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [thanks, setThanks] = useState(false)
  const [loading, setLoading] = useState(false)
  const [issueLink, setIssueLink] = useState()

  const { showToast } = useContext(ToastContext)

  const { handleSubmit, register, reset } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true
  })

  useEffect(() => {
    reset({ issuePage: referer } )
  }, [referer, reset])

  const getProjectKey = (issuePage) => {
    const projectKeys = new Map([
      ['bb-information-mediation', 'IM'],
      ['bb-consent', 'CON'],
      ['bb-digital-registries', 'DR'],
      ['bb-identity', 'ID'],
      ['bb-messaging', 'MSG'],
      ['bb-payments', 'PAY'],
      ['bb-registration', 'REG'],
      ['bb-scheduler', 'SKD'],
      ['bb-workflow', 'WF'],
      ['bb-ux', 'UX'],
      ['bb-esignature', 'SIG'],
      ['bb-emarketplace', 'MKT'],
      ['bb-cms', 'CMS'],
      ['bb-cloud-infrastructure-hosting', 'INF']
    ])
    const match = issuePage.match('(bb-[a-z|-]*)')

    if (!match) {
      if (issuePage.match('(govstack-country-engagement-playbook)'))
        return 'GSCIJ'
      else if (issuePage.match('(use-cases)'))
        return 'PRD'
      else if (issuePage.match('(sandbox)'))
        return 'SND'
      else
        return 'TECH'
    }

    return projectKeys.get(match[0])
  }

  const submitMessage = async (data) => {
    setLoading(true)
    const { name, email, issuePage, issue } = data

    const encodedEmail = Buffer.from(email).toString('base64')
    const projectKey = getProjectKey(issuePage)

    const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_SERVER}/create_issue?project_key=${projectKey}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_RAILS_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie'
      },
      body: JSON.stringify({
        name,
        encoded_email: encodedEmail,
        issue_page: issuePage,
        issue
      })
    })

    if (response.status === 201) {
      const { data } = await response.json()
      setIssueLink('https://govstack-global.atlassian.net/browse/' + data?.key)
      setThanks(true)
    } else {
      showToast(
        format('govstack.issue.submitFailed'),
        'error',
        'top-center'
      )
    }

    setLoading(false)
  }

  return (
    <>
      <Header />
      <div className='min-h-screen px-4 text-center'>
        <span className='inline-block h-screen align-middle' aria-hidden='true'>&#8203;</span>
        <div
          className={`
            inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle
            transition-all transform bg-white shadow-xl rounded-2xl
          `}
        >
          <div className='text-4xl font-bold text-dial-gray-dark mt-12'>
            {format('govstack.feedback.header')}
          </div>
          <div className='text-xl text-dial-gray-dark my-8'>
            {format('govstack.feedback.intro')}
          </div>
          <form onSubmit={handleSubmit(submitMessage)}>
            <div id='thankyou' className={`${!thanks && 'hidden'} text-lg text-emerald-500 px-2`}>
              {format('report.thankyou')}
              <br />
              {format('govstack.feedback.track')}
              <a className='text-dial-sunshine' href={`${issueLink}`} target='_blank' rel='noreferrer'>
                {format('govstack.feedback.link')}
              </a>
            </div>
            <div className='ml-auto grid grid-cols-1 gap-3 py-3 px-2'>
              <div className='grid'>
                <label className='block text-lg text-dial-blue mb-2' htmlFor='name'>
                  {format('govstack.feedback.name')}
                </label>
                <input
                  {...register('name', { required: true })}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                />
              </div>
              <div className='grid'>
                <label className='block text-lg text-dial-blue mb-2' htmlFor='email'>
                  {format('govstack.feedback.email')}
                </label>
                <input
                  {...register('email', { required: true })}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                />
                <div className='mt-2 text-dial-gray-dark text-sm'>{format('govstack.feedback.emailDisclaimer')}</div>
              </div>
              <div className='grid'>
                <label className='block text-lg text-dial-blue mb-2' htmlFor='page'>
                  {format('govstack.feedback.page')}
                </label>
                <input
                  {...register('issuePage', { required: false })}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                />
                <div className='mt-2 text-dial-gray-dark text-sm'>{format('govstack.feedback.pageDisclaimer')}</div>
              </div>
              <div className='grid'>
                <label className='block text-lg text-dial-blue mb-2' htmlFor='name'>
                  {format('govstack.feedback.issue')}
                </label>
                <textarea
                  {...register('issue', { required: true })}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker h-24'
                />
              </div>
              <div className='flex'>
                <button
                  type='submit'
                  className='bg-dial-blue text-dial-gray-light py-2 px-4 rounded disabled:opacity-50 flex gap-3'
                  disabled={thanks || loading}
                >
                  {format('govstack.feedback.submit')}
                  {loading && <FaSpinner className='spinner inline my-auto' />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      referer: context.req.headers?.referer ? context.req.headers.referer : null
    }
  }
}

export default GovStackIssueForm
