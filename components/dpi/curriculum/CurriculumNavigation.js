import { useCallback, useContext, useEffect, useState } from 'react'
import { MdPlayArrow } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { CurriculumContext, OVERVIEW_SLUG_NAME } from './CurriculumCoordinator'

const CurriculumNavigation = ({ curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mappedSubModules, setMappedSubModules] = useState({})

  const { playbookPlays: curriculumModules } = curriculum

  const navigateToPlay = (e, slug) => {
    e.preventDefault()
    setCurrentSlug(slug)
    console.log('Slug clicked: ', slug)
  }

  const { currentSlug, setCurrentSlug } = useContext(CurriculumContext)

  useEffect(() => {
    if ( curriculum) {
      const { plays: modules } = curriculum

      setMappedSubModules(previousMappedMoves => {
        const moves = { ...previousMappedMoves }
        modules.forEach(module => {
          const { playMoves: subModules } = module
          const submoduleNames = subModules.map(subModule => subModule.name)
          moves[module.slug] = submoduleNames
        })

        return moves
      })
    }
  }, [curriculum])

  return (
    <div className='flex flex-col text-dial-stratos'>
      <div className={currentSlug === OVERVIEW_SLUG_NAME ? 'hover:bg-dial-slate-300' : undefined}>
        <div className={currentSlug === OVERVIEW_SLUG_NAME ? 'bg-dial-slate-500 text-white' : undefined}>
          <a href='#' onClick={(e) => navigateToPlay(e, OVERVIEW_SLUG_NAME)}>
            <div className='py-4 px-8'>
              {format('ui.playbook.overview')}
            </div>
          </a>
        </div>
      </div>
      {curriculumModules.map((curriculumModule, index) => {
        return (
          <div
            key={`playbook-plays-${index}`}
            className={currentSlug === curriculumModule.playSlug ? 'bg-dial-slate-500' : undefined}
          >
            <a href='#' onClick={(e) => navigateToPlay(e, curriculumModule.playSlug)}>
              <div className={currentSlug === curriculumModule.playSlug ? 'bg-dial-slate-500 text-white' : undefined}>
                <div className='flex flex-col gap-y-1 py-3 px-8'>
                  {`${format('dpi.curriculum.module')} ${index + 1}. ${curriculumModule.playName}`}
                  {currentSlug === curriculumModule.playSlug && mappedSubModules[curriculumModule.playSlug] &&
                    mappedSubModules[curriculumModule.playSlug].map((moveName, index) =>
                      <div key={`playbook-play-move-${index}`} className='flex gap-x-2'>
                        <MdPlayArrow size='0.8rem' className='my-auto' />
                        {moveName}
                      </div>
                    )
                  }
                </div>
              </div>
            </a>
          </div>
        )
      })}
    </div>
  )
}

export default CurriculumNavigation
