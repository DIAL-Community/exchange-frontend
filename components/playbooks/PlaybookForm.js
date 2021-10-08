import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useMutation } from "@apollo/react-hooks"
import gql from 'graphql-tag'

import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'

import { HtmlEditor } from '../../components/shared/HtmlEditor'
import { descriptionByLocale } from '../../lib/utilities'

const CREATE_PLAYBOOK = gql`
mutation ($name: String!, $overview: String!, $audience: String, $outcomes: String, $locale: String!, $action: String!) {
  createPlaybook(name: $name, overview: $overview, audience: $audience, outcomes: $outcomes, locale: $locale, action: $action) {
    playbook {
      id
      name
      slug
      playbookDescriptions {
        overview
        audience
        outcomes
      }
    }
  }
}
`

export const PlaybookForm = ({playbook, action}) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { locale } = useRouter()

  const [createPlaybook, { data, loading }] = useMutation(CREATE_PLAYBOOK)  // {update: updateCache}

  const [name, setName] = useState(playbook ? playbook.name : '')
  const [overview, setOverview] = useState(playbook ? descriptionByLocale(playbook.playbookDescriptions, locale, 'overview') : '')
  const [audience, setAudience] = useState(playbook ? descriptionByLocale(playbook.playbookDescriptions, locale, 'audience') : '')
  const [outcomes, setOutcomes] = useState(playbook ? descriptionByLocale(playbook.playbookDescriptions, locale, 'outcomes') : '')

  const router = useRouter()

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push(`/${locale}/playbooks`)
      }, 2000)
    }
  }, [data])

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const doUpsert = async e => {
    e.preventDefault()
    createPlaybook({variables: {name, overview, audience, outcomes, locale, action }});
  }

  return (
    <div className='pt-4'>
      <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{format('playbook.created')}</div>
      </div>
      <div id='content' className='px-4 sm:px-0 max-w-full mx-auto'>
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
                {format('playbooks.overview')}
            </label>
            <HtmlEditor updateText={setOverview} initialContent={overview} />
            <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('playbooks.audience')}
            </label>
            <HtmlEditor updateText={setAudience} initialContent={audience} />
            <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
                {format('playbooks.outcomes')}
            </label>
            <HtmlEditor updateText={setOutcomes} initialContent={outcomes} />
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
    </div>
  )
}
