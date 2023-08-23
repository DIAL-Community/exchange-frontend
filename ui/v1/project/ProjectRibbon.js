import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'

const ProjectRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <div className='bg-dial-plum rounded-full w-[70px] h-[70px]'>
      <img
        src='/ui/v1/project-header.svg'
        alt={format('ui.image.logoAlt', { name: format('ui.project.label') })}
        width={40}
        height={40}
        className='object-contain white-filter mx-auto mt-4'
      />
    </div>

  return (
    <Ribbon
      ribbonBg='bg-dial-violet'
      titleImage={titleImage}
      titleKey={'ui.project.header'}
      titleColor='text-dial-plum'
    />
  )
}

export default ProjectRibbon
