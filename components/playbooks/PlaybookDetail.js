import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

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
        <div className='h4 font-bold py-4'>{format('playbooks.label')}</div>
      {format('playbooks.overview')}
      <div className='fr-view text-dial-gray-dark'>
        {ReactHtmlParser(descriptionByLocale(playbook.playbookDescriptions, locale, 'overview'))}
      </div>
      {format('playbooks.audience')}
      <div className='fr-view text-dial-gray-dark'>
        {ReactHtmlParser(descriptionByLocale(playbook.playbookDescriptions, locale, 'audience'))}
      </div>
      {format('playbooks.outcomes')}
      <div className='fr-view text-dial-gray-dark'>
        {ReactHtmlParser(descriptionByLocale(playbook.playbookDescriptions, locale, 'outcomes'))}
      </div>
      <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='name'>
        {format('playbooks.phases')}
      </label>
      { playbook.phases && playbook.phases.map((phase, i) => {
          return (<div key={i} className='inline w-full'>
            <div className='inline w-1/3 shadow appearance-none border rounded py-2 px-3 text-grey-darker'>
              {phase.name}
            </div>
            <div className='inline w-1/3 shadow appearance-none border rounded py-2 px-3 text-grey-darker'>
              {phase.description}
            </div>
          </div> 
        )
      })}
      <label className='block text-grey-darker text-sm font-bold my-2'>
        {format('playbooks.plays')}
      </label>
      { playbook.plays && playbook.plays.map((play, i) => {
          return (<div key={i} className='inline w-full'>
            {play.name}
          </div>
        )
      })}
    </div>
  )
}

export default PlaybookDetail
