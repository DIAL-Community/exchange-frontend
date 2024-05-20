import CurriculumModule from './CurriculumModule'

const CurriculumModules = ({ curriculum, moduleRefs }) => {
  const { plays: modules } = curriculum

  return (
    <div className='curriculum-modules'>
      {modules.map((module, i) =>
        <div className='flex flex-col gap-3' key={i}>
          <hr className='border-b border-dial-slate-200 mt-5' />
          <CurriculumModule
            index={i}
            curriculumSlug={curriculum.slug}
            moduleSlug={module.slug}
            moduleRefs={moduleRefs}
          />
        </div>
      )}
    </div>
  )
}

export default CurriculumModules
