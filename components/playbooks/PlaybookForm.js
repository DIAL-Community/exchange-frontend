import { useState, useEffect, useRef } from 'react'

import withApollo from '../../lib/apolloClient'
import { useMutation } from "@apollo/react-hooks"
import gql from 'graphql-tag'

import { useIntl } from 'react-intl'

import { HtmlEditor } from '../../components/shared/HtmlEditor'

const CREATE_PLAYBOOK = gql`
mutation ($name: String!, $description: String!) {
  createPlaybook(name: $name, description: $description) {
    playbook {
      id
      name
      slug
      playbookDescriptions {
        overview
      }
    }
  }
}
`

export const PlaybookForm = ({playbook}) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [createPlaybook, { data, loading }] = useMutation(CREATE_PLAYBOOK)  // {update: updateCache}

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const doUpsert = async e => {
    e.preventDefault()

    createPlaybook({variables: {name: name, description: description }});
  }

  return (
    <div className='pt-4'>
        <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
          <div className='my-auto text-green-500'>{format('candidateProduct.created')}</div>
        </div>
        <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'></div>
          <form onSubmit={doUpsert}>
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
              <div className='mb-4'>
                <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                  {format('playbooks.name')}
                </label>
                <input
                  id='name' name='name' type='text' placeholder={format('playbooks.name.placeholder')}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                  value={name} onChange={(e) => handleTextFieldChange(e, setName)}
                />
              </div>
              <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                  {format('playbooks.description')}
              </label>
              <HtmlEditor updateText={setDescription} initialContent={playbook && playbook.description} />
              <div>{description}</div>
              <div className='flex items-center justify-between font-semibold text-sm mt-2'>
                <button
                  className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                  type='submit' disabled={loading}
                >
                  {format('playbooks.submit')}
                  {loading && <FaSpinner className='spinner ml-3' />}
                </button>
              </div>
            </div>
          </form>
        </div>
  )
}
