import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'

import { HtmlEditor } from '../../components/shared/HtmlEditor'
import { descriptionByLocale } from '../../lib/utilities'

import dynamic from 'next/dynamic'
const PlayListQuery = dynamic(() => import('../../components/plays/PlayList'), { ssr: false })

const CREATE_PLAYBOOK = gql`
mutation ($name: String!, $slug: String!, $overview: String!, $audience: String, $outcomes: String, $phases: JSON!, $plays: JSON!, $locale: String!) {
  createPlaybook(name: $name, slug: $slug, overview: $overview, audience: $audience, outcomes: $outcomes, phases: $phases, plays: $plays, locale: $locale) {
    playbook {
      id
      name
      slug
      phases
      playbookDescriptions {
        overview
        audience
        outcomes
      }
      plays {
        id
        name
      }
    }
  }
}
`

export const PlaybookForm = ({ playbook, action }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { locale } = useRouter()

  const [createPlaybook, { data, loading }] = useMutation(CREATE_PLAYBOOK) // {update: updateCache}

  const [showPlayForm, setShowPlayForm] = useState(false)
  const [name, setName] = useState(playbook ? playbook.name : '')
  const [slug] = useState(playbook ? playbook.slug : '')
  const [phases, setPhases] = useState(playbook ? playbook.phases.map((phase, i) => ({ ...phase, i: i })) : [])
  const [overview, setOverview] = useState(playbook ? descriptionByLocale(playbook.playbookDescriptions, locale, 'overview') : '')
  const [audience, setAudience] = useState(playbook ? descriptionByLocale(playbook.playbookDescriptions, locale, 'audience') : '')
  const [outcomes, setOutcomes] = useState(playbook ? descriptionByLocale(playbook.playbookDescriptions, locale, 'outcomes') : '')
  const [plays, setPlays] = useState(playbook ? playbook.plays : [])

  const router = useRouter()

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push(`/${locale}/playbooks/${playbook.slug}`)
      }, 2000)
    }
  }, [data])

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const handlePhaseChange = (e, i) => {
    if (e.target.getAttribute('name') === 'phaseName') {
      setPhases(phases.map(phase => phase.i === i ? { ...phase, name: e.target.value } : phase))
    } else {
      setPhases(phases.map(phase => phase.i === i ? { ...phase, description: e.target.value } : phase))
    }
  }

  const addPhase = (e) => {
    e.preventDefault()
    setPhases([...phases, { name: '', description: '', i: phases.length }])
  }

  const deletePhase = (e, i) => {
    e.preventDefault()
    setPhases(phases.map(phase => phase.i === i ? { name: '', description: '' } : phase))
  }

  const assignPlay = (e, play) => {
    e.preventDefault()
    setPlays([...plays, play])
    setShowPlayForm(false)
  }

  const unassignPlay = (e, removePlay) => {
    e.preventDefault()
    setPlays(plays.map(play => play.name === removePlay.name ? { name: '', description: '' } : play))
  }

  const doUpsert = async e => {
    e.preventDefault()
    setPhases(phases.map(phase => { delete phase.i; return phase }))
    const submitPhases = phases.map(phase => phase.name === '' ? null : phase)
    const submitPlays = plays.map(play => play.name === '' ? null : play)
    createPlaybook({ variables: { name, slug, overview, audience, outcomes, phases: submitPhases, plays: submitPlays, locale } })
  }

  return (
    <div className='pt-4'>
      <div className={`mx-4 ${data ? 'visible' : 'invisible'} text-center pt-4`}>
        <div className='my-auto text-green-500'>{action === 'create' ? format('playbook.created') : format('playbook.updated')}</div>
      </div>
      {action === 'update' && format('app.edit-entity', { entity: name })}
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
            <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
              {format('playbooks.phases')}
            </label>
            {phases && phases.map((phase, i) => {
              return (
                <div key={i} className='inline'>
                  <input
                    id={'phaseName' + i} name='phaseName' type='text' placeholder={format('playbooks.phase.name')}
                    className='inline w-1/3 shadow appearance-none border rounded py-2 px-3 text-grey-darker'
                    value={phase.name} onChange={(e) => handlePhaseChange(e, i)}
                  />
                  <input
                    id={'phaseDesc' + i} name='phaseDesc' type='text' placeholder={format('playbooks.phase.description')}
                    className='inline w-1/3 shadow appearance-none border rounded py-2 px-3 text-grey-darker'
                    value={phase.description} onChange={(e) => handlePhaseChange(e, i)}
                  />
                  <button
                    className='inline bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                    onClick={(e) => deletePhase(e, i)} disabled={loading}
                  >
                    {format('playbooks.deletePhase')}
                  </button>
                </div>
              )
            })}
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                onClick={addPhase} disabled={loading}
              >
                {format('playbooks.addPhase')}
              </button>
            </div>
            <div className='flex items-center justify-between font-semibold text-sm mt-2'>
              <button
                className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                onClick={(e) => { e.preventDefault(); setShowPlayForm(true) }}
              >
                {format('playbooks.assignPlay')}
              </button>
            </div>
            <div className={`${!showPlayForm && 'hidden'}`}>
              <PlayListQuery displayType='assign' assignCallback={assignPlay} />
            </div>
            {plays && plays.map((play, i) => {
              return (
                <div key={i} className='inline'>
                  <div className='border-3 border-transparent hover:border-dial-yellow text-workflow hover:text-dial-yellow cursor-pointer'>
                    {play.name}
                    <button
                      className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                      onClick={(e) => { unassignPlay(e, play) }}
                    >
                      {format('playbooks.unassignPlay')}
                    </button>
                  </div>
                </div>
              )
            }
            )}
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
