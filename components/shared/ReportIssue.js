import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import Select from 'react-select'
import { Description, Dialog, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import Input from './form/Input'

const ReportIssue = ({ showForm, hideFeedbackForm, formTitle }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [thanks, setThanks] = useState(false)

  const { handleSubmit, register, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true
  })

  const options = [
    { label: format('report.positive'), value: 'positive' },
    { label: format('report.suggest'), value: 'suggestion' },
    { label: format('report.bug'), value: 'bug' },
    { label: format('report.abuse'), value: 'abuse' }
  ]

  const submitMessage = async (data) => {
    const { name, email, issueType, issue } = data
    await fetch(
      `${process.env.NEXT_PUBLIC_RAILS_SERVER}` +
      `/send_email?email_token=${process.env.NEXT_PUBLIC_EMAIL_TOKEN}`, {
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
          email,
          issue_type: issueType,
          issue
        })
      }
    )
    setThanks(true)
    setTimeout(() => {
      hideFeedbackForm()
    }, 3000)
  }

  return (
    <>
      <Transition appear show={showForm}>
        <Dialog
          as='div'
          className='fixed inset-0 z-100 overflow-y-auto'
          onClose={hideFeedbackForm}
        >
          <div className='min-h-screen px-4 text-center'>
            <TransitionChild
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-dial-gray opacity-80' />
            </TransitionChild>
            <span className='inline-block h-screen align-middle' aria-hidden='true'>
              &#8203;
            </span>
            <TransitionChild
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className={`
                  inline-block w-full max-w-6xl p-6 my-8 overflow-hidden
                  text-left align-middle transition-all transform bg-white
                  shadow-xl rounded-2xl
                `}
              >
                <form onSubmit={handleSubmit(submitMessage)}>
                  <DialogTitle>
                    <div className='flex gap-3 px-2'>
                      <div className='font-semibold text-2xl py-3'>
                        {formTitle}
                      </div>
                    </div>
                  </DialogTitle>
                  <Description>
                    <div
                      id='thankyou'
                      className={`${!thanks && 'hidden'} text-lg text-emerald-500 px-2`}
                    >
                      {format('report.thankyou')}
                    </div>
                    <div className='ml-auto flex flex-col gap-3 py-3 px-2 text-sm text-dial-sapphire'>
                      <div className='flex flex-col gap-y-2'>
                        <label htmlFor='name'>
                          {format('report.name')}
                        </label>
                        <Input {...register('name', { required: true })}/>
                      </div>
                      <div className='flex flex-col gap-y-2'>
                        <label htmlFor='name'>
                          {format('report.email')}
                        </label>
                        <Input {...register('email', { required: true })} />
                      </div>
                      <Controller
                        name='issueType'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => {
                          return (
                            <Select
                              options={options}
                              placeholder={format('report.issueType')}
                              onBlur={onBlur}
                              value={options.find(option => option.value === value)}
                              onChange={val => onChange(val.value)}
                            />
                          )
                        }}
                      />
                      <div className='flex flex-col gap-y-2'>
                        <label htmlFor='issue'>
                          {format('report.issue')}
                        </label>
                        <textarea
                          {...register('issue', { required: true })}
                          className='textarea outline-0'
                        />
                      </div>
                      <div className='flex gap-3 text-base'>
                        <button type='submit' className='submit-button'>
                          {format('app.submit')}
                        </button>
                        <button type='button' className='cancel-button' onClick={hideFeedbackForm}>
                          {format('general.close')}
                        </button>
                      </div>
                    </div>
                  </Description>
                </form>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ReportIssue
