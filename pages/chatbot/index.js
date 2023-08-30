import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useUser } from '../../lib/hooks'
import { Unauthorized } from '../../components/shared/FetchStatus'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import ClientOnly from '../../lib/ClientOnly'

export default function ChatbotPage() {

  const { register, handleSubmit } = useForm()
  const [response, setResponse] = useState()
  const { isAdminUser } = useUser()

  const onSubmit = async (data) => {
    const res = await fetch('http://209.97.159.105:5000/query', {
      mode: 'cors',
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://209.97.159.105:5000',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(data)
    })
    const json = await res.json()
    console.log(json.response)
    setResponse(json.response.response)
  }

  return (
    isAdminUser ?
      <ClientOnly>
        <Header />
        <div className='flex flex-col'>
          <div className='px-4 lg:px-8 xl:px-56 py-4'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input className='w-2/3' {...register('question')} placeholder="Enter your question" />
              <div className='flex gap-3 py-2'>
                <button type='submit' className='secondary-button dial-sapphire'>
                  Submit
                </button>
              </div>
              {response && <div className='px-4 py-4 border'>{response}</div>}
            </form>
          </div>
        </div>
        <Footer />
      </ClientOnly>
      : <>
        <Header />
        <Unauthorized />
        <Footer />
      </>
  )

}
