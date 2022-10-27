import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'

const GovStackIssueForm = ({ referer }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [thanks, setThanks] = useState(false)
  const [issueLink, setIssueLink] = useState()

  const { handleSubmit, register, reset } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true
  })

  useEffect(() => {
    reset({ issuePage: referer } )
  }, [referer])

  const getProjectKey = (issuePage) => {
    const projectKeys = new Map([
      ['bb-information-mediator', 'IM'],
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
      ['bb-cloud-infrastructure-hosting', 'INF'],
    ])
    const match = issuePage.match('(bb-[a-z|-]*)')

    if (!match)
      return 'PRD'

    return projectKeys.get(match[0])
  }

  const submitMessage = async (data) => {
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

    const responseBody = await response.json()
    setIssueLink(responseBody.data?.self)
    setThanks(true)
  }

  return (
    <>
      <header className='z-70 sticky top-0 border-b-2 border-dial-gray-dark bg-white'>
        <div className='flex flex-wrap justify-center items-center py-3 lg:py-0 max-w-catalog header-min-height mx-auto'>
          <div className='flex-1 flex my-auto'>
            <Link href='https://govstack.global' passHref>
              <div className='px-12 lg:px-16 my-4 text-blue-900 hover:cursor-pointer'>
                <svg width="133" height="65" viewBox="0 0 200 98" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M200 97.981V36.096h-5.128v56.747h-35.901V98H200v-.019Zm-24.329-36.096-5.69-8.563 5.69-8.582h-4.872l-4.554 6.863h-2.951V36.14h-4.267v25.72h4.267v-6.844h2.951l4.554 6.87h4.872Zm-30.568-8.582a5.165 5.165 0 0 1 .906-2.928 5.125 5.125 0 0 1 2.403-1.889 5.09 5.09 0 0 1 5.649 1.417l2.882-2.509a8.954 8.954 0 0 0-4.561-2.805 8.917 8.917 0 0 0-5.338.304 8.971 8.971 0 0 0-4.216 3.307 9.05 9.05 0 0 0 0 10.264 8.971 8.971 0 0 0 4.216 3.306 8.917 8.917 0 0 0 5.338.305 8.954 8.954 0 0 0 4.561-2.806l-2.882-2.509a5.091 5.091 0 0 1-5.667 1.41 5.123 5.123 0 0 1-2.401-1.905 5.164 5.164 0 0 1-.89-2.943v-.019Zm-10.356 8.582h4.267V44.722h-4.267v1.882a7.67 7.67 0 0 0-2.537-1.733 7.633 7.633 0 0 0-3.008-.595c-4.623 0-8.11 3.865-8.11 9.015s3.487 9.008 8.11 9.008a7.633 7.633 0 0 0 3.008-.595c.953-.4 1.816-.989 2.537-1.732V61.885Zm.425-8.582a5.172 5.172 0 0 1-.864 2.862 5.125 5.125 0 0 1-2.3 1.897 5.095 5.095 0 0 1-5.582-1.119 5.173 5.173 0 0 1-1.106-5.615 5.147 5.147 0 0 1 1.889-2.31 5.101 5.101 0 0 1 6.466.644 5.137 5.137 0 0 1 1.109 1.671 5.18 5.18 0 0 1 .388 1.97Zm-22.932 8.582h7.255v-3.438h-2.988V48.153h2.776v-3.431h-2.776v-2.86h-4.267v20.023ZM93.893 43.216c0-2.321 1.921-3.645 5.334-3.645 3.412 0 5.333 1.468 5.333 4.078h4.691c0-5.113-3.593-7.942-10.025-7.942-6.431 0-10.018 2.685-10.018 7.51 0 10.94 15.596 4.503 15.596 11.586 0 2.358-1.991 3.644-5.546 3.644-3.556 0-5.546-1.461-5.546-4.07h-4.698c0 5.112 3.662 7.935 10.244 7.935 6.581 0 10.237-2.685 10.237-7.528 0-10.94-15.596-4.504-15.596-11.587l-.006.02ZM78.965 62.732l8.427-18.017h-4.479l-3.948 8.438-3.95-8.438h-4.478l8.427 18.017Zm-8.254-9.41a9.044 9.044 0 0 0-1.5-5.01 8.97 8.97 0 0 0-4.018-3.326 8.912 8.912 0 0 0-5.178-.52 8.943 8.943 0 0 0-4.592 2.463 9.024 9.024 0 0 0-2.456 4.614 9.055 9.055 0 0 0 .51 5.208 8.997 8.997 0 0 0 3.302 4.044 8.923 8.923 0 0 0 4.98 1.517 8.946 8.946 0 0 0 6.32-2.638 9.047 9.047 0 0 0 2.632-6.352Zm-3.836 0c0 1.019-.3 2.015-.864 2.862a5.128 5.128 0 0 1-2.298 1.897 5.095 5.095 0 0 1-5.582-1.117 5.178 5.178 0 0 1-1.11-5.613 5.145 5.145 0 0 1 1.887-2.311 5.102 5.102 0 0 1 6.466.64 5.153 5.153 0 0 1 1.5 3.642Zm-15.858-4.29c0-.527-.036-1.053-.106-1.575H38.004v3.858h8.459a8.695 8.695 0 0 1-2.975 4.787 8.61 8.61 0 0 1-5.272 1.938 8.925 8.925 0 0 1-4.296-1.086 8.984 8.984 0 0 1-3.255-3.021 9.048 9.048 0 0 1-.655-8.608 9.007 9.007 0 0 1 2.76-3.484 8.918 8.918 0 0 1 8.49-1.283 8.964 8.964 0 0 1 3.656 2.514l3.238-2.823a13.23 13.23 0 0 0-5.384-3.726 13.162 13.162 0 0 0-12.53 1.85 13.293 13.293 0 0 0-4.092 5.124 13.371 13.371 0 0 0 .913 12.703 13.26 13.26 0 0 0 4.781 4.48 13.175 13.175 0 0 0 6.33 1.632c7.074 0 12.801-5.935 12.801-13.3l.044.02ZM5.127 5.174h35.896V0H0v61.885h5.128V5.157v.018Z" fill="currentColor"></path></svg>
              </div>
            </Link>
          </div>
        </div>
      </header>
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
              {format('govstack.feedback.track')} <a className='text-dial-yellow' href={`${issueLink}`} target='_blank' rel='noreferrer'>{format('govstack.feedback.link')}</a>
            </div>
            <div className='ml-auto grid grid-cols-1 gap-3 py-3 px-2'>
              <div className='grid'>
                <label className='block text-lg text-dial-blue mb-2' htmlFor='name'>
                  {format('govstack.feedback.name')}
                </label>
                <input {...register('name', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' />
              </div>
              <div className='grid'>
                <label className='block text-lg text-dial-blue mb-2' htmlFor='email'>
                  {format('govstack.feedback.email')}
                </label>
                <input {...register('email', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' />
                <div className='mt-2 text-dial-gray-dark text-sm'>{format('govstack.feedback.emailDisclaimer')}</div>
              </div>
              <div className='grid'>
                <label className='block text-lg text-dial-blue mb-2' htmlFor='page'>
                  {format('govstack.feedback.page')}
                </label>
                <input {...register('issuePage', { required: false })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' />
                <div className='mt-2 text-dial-gray-dark text-sm'>{format('govstack.feedback.pageDisclaimer')}</div>
              </div>
              <div className='grid'>
                <label className='block text-lg text-dial-blue mb-2' htmlFor='name'>
                  {format('govstack.feedback.issue')}
                </label>
                <textarea {...register('issue', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker h-24' />
              </div>
              <div className='flex'>
                <button
                  type='submit' className='w-40 mr-2 bg-dial-blue text-dial-gray-light py-2 px-4 rounded disabled:opacity-50' disabled={thanks}
                >
                  {format('govstack.feedback.submit')}
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
