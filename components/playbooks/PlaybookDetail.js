import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'
import { useRouter } from 'next/router'

import { descriptionByLocale } from '../../lib/utilities'
import PlayNavigator from './PlayNavigator'

const PlaybookDetail = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const { locale } = useRouter()
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/${locale}/playbooks/${playbook.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[playbook.slug] = playbook.name
    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='w-full'>
        {
          session && (
            <div className='inline'>
              {
                session.user.canEdit && (
                  <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                    <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                    <span className='text-sm px-2'>{format('app.edit')}</span>
                  </a>
                )
              }
            </div>
          )
        }
      </div>
      <div className='h4 font-bold py-4'>{format('playbooks.label')}: {playbook.name}</div>
      <div className='p-3 h4'>{format('playbooks.overview')}</div>
      <div className='fr-view text-dial-gray-dark px-4'>
        {ReactHtmlParser(descriptionByLocale(playbook.playbookDescriptions, locale, 'overview'))}
      </div>
      <div className='p-3 h4'>{format('playbooks.audience')}</div>
      <div className='fr-view text-dial-gray-dark px-4'>
        {ReactHtmlParser(descriptionByLocale(playbook.playbookDescriptions, locale, 'audience'))}
      </div>
      <div className='p-3 h4'>{format('playbooks.outcomes')}</div>
      <div className='fr-view text-dial-gray-dark px-4'>
        {ReactHtmlParser(descriptionByLocale(playbook.playbookDescriptions, locale, 'outcomes'))}
      </div>
      <div className='block text-grey-darker text-sm h4 p-3'>
        {format('playbooks.phases')}
      </div>
      {playbook.phases && playbook.phases.map((phase, i) => {
        return (
          <div key={i} className='grid grid-cols-3 px-4'>
            <div className='shadow appearance-none border rounded py-2 px-3 text-grey-darker'>
              {phase.name}
            </div>
            <div className='shadow appearance-none border rounded py-2 px-3 text-grey-darker'>
              {phase.description}
            </div>
          </div>
        )
      })}
      <div className='block text-grey-darker text-sm h4 p-3'>
        {format('playbooks.plays')}
      </div>
      {playbook.plays &&
        (
          <PlayNavigator playList={playbook.plays} />
        )}
    </div>
  )
}

export default PlaybookDetail
