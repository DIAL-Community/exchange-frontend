/* global fetch: false */

import { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import { Controller, useForm } from 'react-hook-form'
import { Dialog, Transition } from '@headlessui/react'
import Select from 'react-select'

const ReportIssue = ({ showForm, setShowForm, formTitle }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [thanks, setThanks] = useState(false)

  const { handleSubmit, register, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true
  })

  const options = [{ label: format('report.positive'), value: 'positive' }, { label: format('report.bug'), value: 'bug' }, { label: format('report.suggest'), value: 'suggestion' }]

  const submitMessage = async (data) => {
    const { name, email, issueType, issue } = data
    await fetch(`${process.env.NEXT_PUBLIC_RAILS_SERVER}/send_email?email_token=${process.env.NEXT_PUBLIC_EMAIL_TOKEN}`, {
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
        name: name,
        email: email,
        issue_type: issueType,
        issue: issue
      })
    })
    setThanks(true)
    setTimeout(() => {
      setShowForm(false)
    }, 3000)
  }

  return (
    <>
      <Transition appear show={showForm} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 z-100 overflow-y-auto' onClose={() => setShowForm(false)}>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-dial-gray opacity-80' />
            </Transition.Child>
            <span className='inline-block h-screen align-middle' aria-hidden='true'>&#8203;</span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className={`
                  inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle
                  transition-all transform bg-white shadow-xl rounded-2xl
                `}
              >
                <form onSubmit={handleSubmit(submitMessage)}>
                  <Dialog.Title>
                    <div className='flex gap-3 px-2'>
                      <div className='font-semibold text-2xl py-3'>
                        {formTitle}
                      </div>
                    </div>
                  </Dialog.Title>
                  <Dialog.Description>
                    <div id='thankyou' className={`${!thanks && 'hidden'} text-lg text-emerald-500 px-2`}>{format('report.thankyou')}</div>
                    <div className='ml-auto grid grid-cols-1 gap-3 py-3 px-2'>
                      <div className='grid'>
                        <label className='block text-lg text-dial-blue mb-2' htmlFor='name'>
                          {format('report.name')}
                        </label>
                        <input {...register('name', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' />
                      </div>
                      <div className='grid'>
                        <label className='block text-lg text-dial-blue mb-2' htmlFor='name'>
                          {format('report.email')}
                        </label>
                        <input {...register('email', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' />
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
                      <div className='grid'>
                        <label className='block text-lg text-dial-blue mb-2' htmlFor='name'>
                          {format('report.issue')}
                        </label>
                        <textarea {...register('issue', { required: true })} className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker h-24' />
                      </div>
                      <div className='flex'>
                        <button
                          type='submit' className='w-24 mr-2 bg-dial-blue text-dial-gray-light py-2 px-4 rounded disabled:opacity-50'
                        >
                          {format('app.submit')}
                        </button>
                        <button
                          type='button' className='w-24 ml-2 bg-button-gray-light text-white py-2 px-4 rounded disabled:opacity-50'
                          onClick={() => setShowForm(false)}
                        >
                          {format('general.close')}
                        </button>
                      </div>
                    </div>
                  </Dialog.Description>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ReportIssue
