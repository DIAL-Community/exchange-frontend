import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import Breadcrumb from '../../shared/breadcrumb'
import { HtmlViewer } from '../../shared/HtmlViewer'
import EditButton from '../../shared/EditButton'

const MoveDetail = ({ play, move }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { user } = useUser()

  const canEdit = () => user && (user.isAdminUser || user.isEditorUser)

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
      <div className='flex mt-4'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
        <div className='ml-auto my-auto'>
          { canEdit() && <EditButton type='link' href={generateEditLink()} />}
        </div>
      </div>
      <div className='h4 font-bold'>
        {format('ui.move.label')}: {move.name}
      </div>
      {format('ui.move.description')}
      <HtmlViewer
        initialContent={move?.moveDescription?.description}
        editorId='move-detail'
      />
    </div>
  )
}

export default MoveDetail
