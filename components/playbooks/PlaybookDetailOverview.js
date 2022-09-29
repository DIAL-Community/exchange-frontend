import { createRef, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import PlaybookDetailMenu from './PlaybookDetailMenu'
import { PlaybookDetailDispatchContext } from './PlaybookDetailContext'

export const OVERVIEW_SLUG_NAME = 'base-slug-overview-information'

const PlaybookDetailOverview = ({ playbook, locale, allowEmbedCreation, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [height, setHeight] = useState(0)
  const { updateSlugInformation } = useContext(PlaybookDetailDispatchContext)

  const ref = createRef()

  useEffect(() => {
    // Update context for this overview. We're using fake slug data for this.
    updateSlugInformation(OVERVIEW_SLUG_NAME, 0, height)
  }, [height])

  useEffect(() => {
    // Update scrolling state information based on the observer data.
    if (!ref.current) {
      return
    }

    const boundingClientRect = ref.current.getBoundingClientRect()
    setHeight(boundingClientRect.height)
  }, [ref])

  return (
    <div className='flex flex-col gap-3 px-3' ref={ref}>
      <PlaybookDetailMenu
        playbook={playbook}
        locale={locale}
        allowEmbedCreation={allowEmbedCreation}
        commentsSectionRef={commentsSectionRef}
      />
      <div className='h4'>{format('playbooks.overview')}</div>
      <div className='fr-view tiny-editor text-dial-gray-dark'>
        {parse(playbook.playbookDescription.overview)}
      </div>
      <div className='h4'>{format('playbooks.audience')}</div>
      <div className='fr-view tiny-editor text-dial-gray-dark'>
        {parse(playbook.playbookDescription.audience)}
      </div>
      <div className='h4'>{format('playbooks.outcomes')}</div>
      <div className='fr-view tiny-editor text-dial-gray-dark'>
        {parse(playbook.playbookDescription.outcomes)}
      </div>
      {playbook.author && <><div className='h4'>{format('playbook.author')}:</div><div className='text-dial-gray-dark'>&nbsp;{playbook.author}</div></>}
    </div>
  )
}

export default PlaybookDetailOverview
