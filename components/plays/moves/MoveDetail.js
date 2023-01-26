import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import Breadcrumb from '../../shared/breadcrumb'
import { HtmlViewer } from '../../shared/HtmlViewer'

const MoveDetail = ({ play, move }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const { user, isAdminUser } = useUser()

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `${move.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[play.slug] = play.name
    map[move.slug] = move.name

    return map
  })()

  return (
    <div className='flex flex-col gap-3 pb-8 max-w-screen-lg'>
      <div className='flex'>
        <div className='hidden lg:block'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='w-full flex justify-end mt-4'>
          {
            user && (
              <div className='inline'>
                {
                  isAdminUser && (
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
      </div>
      <div className='h4 font-bold'>
        {format('move.label')}: {move.name}
      </div>
      {format('moves.description')}
      <HtmlViewer
        initialContent={move?.moveDescription?.description}
        editorId='move-detail'
      />
    </div>
  )
}

export default MoveDetail
